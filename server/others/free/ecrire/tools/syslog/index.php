<?php
# ***** BEGIN LICENSE BLOCK *****
# This file is part of DotClear.
# Copyright (c) 2004 Olivier Meunier and contributors. All rights
# reserved.
#
# DotClear is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
# 
# DotClear is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with DotClear; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
#
# ***** END LICENSE BLOCK *****

require dirname(__FILE__).'/../../../inc/classes/class.multipage.php';

$nb_per_page = 40;

# Vidange des logs
if (!empty($_GET['empty']))
{
	$delReq = 'DELETE FROM '.$blog->t_log;
	
	if ($con->execute($delReq) !== false) {
		$_GET['msg'] = __('Logs have been cleared');
	}
}

buffer::str(
'<h2>'.__('DotClear "syslog"').'</h2>'
);

# Récupération des logs
$rs = $con->select('SELECT count(*) FROM '.$blog->t_log);
$nb_log = $rs->f(0);

$max_pages = ceil($nb_log/$nb_per_page);
$env = (!empty($_GET['env']) && (integer)$_GET['env'] <= $max_pages) ? (integer)$_GET['env'] : 1;

$strReq = 'SELECT `user_id`,`table`,`key`,`date`,`ip`,`log` '.
		'FROM '.$blog->t_log.' '.
		'ORDER BY `date` DESC '.
		'LIMIT '.(($env-1)*$nb_per_page).','.$nb_per_page;

$rs = $con->select($strReq);

$lum = new multipage($env,'log_line',$rs->getData(),$nb_log,$nb_per_page);

$lum->setOption('html_block','<table class="clean-table">'.
			'<tr><th>'.__('Date').'</th><th>'.__('User').'</th><th>'.__('IP').'</th>'.
			'<th>'.__('Log').'</th><th>'.__('Table').'</th><th>'.__('Key').'</th></tr>%s</table>');
$lum->setOption('html_row','<tr>%s</tr>');
$lum->setOption('html_cell','%s');

$lum->setOption('html_links','<p>'.__('Page(s)').' : %s</p>');
$lum->setOption('html_cur_page','<strong>%s</strong>');

$lum->setOption('html_prev','&lt;'.__('prev. page'));
$lum->setOption('html_next',__('next page').'&gt;');
$lum->setOption('html_prev_grp','...');
$lum->setOption('html_next_grp','...');

$lum->setOption('html_empty','<p><strong>'.__('No log yet.').'</strong></p>');

buffer::str(
	$lum->getLinks().
	$lum->getPage().
	$lum->getLinks()
);

if (!$rs->isEmpty()) {
	buffer::str(
	'<p><a href="tools.php?p=syslog&amp;empty=1">'.__('Clear logs').'</a></p>'
	);
}

# Fonction d'affichage des log
function log_line($data,$i)
{
	$style = ($i%2 == 0) ? ' style="background:#eee;"' : '';
	
	return
	'<td'.$style.'>'.$data['date'].'</td>'.
	'<td'.$style.'>'.$data['user_id'].'</td>'.
	'<td'.$style.'>'.$data['ip'].'</td>'.
	'<td'.$style.'>'.$data['log'].'</td>'.
	'<td'.$style.'>'.$data['table'].'</td>'.
	'<td'.$style.'>'.$data['key'].'</td>';
}
?>