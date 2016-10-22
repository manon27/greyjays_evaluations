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

buffer::str(
'<h2>'.__('Informations').'</h2>'.
'<h3>'.__('General informations').'</h3>'
);

# Version de dotclear
buffer::str(
sprintf(__('You are using DotClear version %s'),'<strong>'.DC_VERSION.'</strong>').'</p>'
);

# Les tables de la base de données
$rs = $con->select('SHOW TABLE STATUS LIKE \''.DB_PREFIX.'%\'');

buffer::str(
'<p>'.__('DotClear tables in your database are').'&nbsp;:</p>'.
'<table class="clean-table">'.
'<tr><th>'.__('Name').'</th><th>'.__('Records').'</th><th>'.__('Size').'</th></tr>'
);

while ($rs->fetch())
{
	buffer::str(
	'<tr>'.
	'<td>'.$rs->f('name').'</td>'.
	'<td>'.$rs->f('rows').'</td>'.
	'<td>'.files::size($rs->f('Data_length')+$rs->f('Index_length')).'</td>'.
	'</tr>'
	);
}
buffer::str('</table>');

buffer::str(
'<h3>'.__('Files informations').'</h3>'.
'<p>'.__('Files or directories permissions. If a file or a folder from this '.
'list is not writable, it wont prevent DotClear to work properly. It will only '.
'prevent some tools to work.').'</p>'
);

$img_check = '<img src="images/check_%s.png" alt="" />';

if (is_writable(dirname(__FILE__).'/../../../conf/dotclear.ini')) {
	buffer::str(
	'<p>'.sprintf($img_check,'on').' '.
	sprintf(__('File %s is writable.'),'conf/dotclear.ini').
	'</p>'
	);
} else {
	buffer::str(
	'<p>'.sprintf($img_check,'off').' '.
	sprintf(__('File %s is not writable.'),'conf/dotclear.ini').
	'</p>'
	);
}

if (is_writable(dirname(__FILE__).'/../../../conf/UPDATE')) {
	buffer::str(
	'<p>'.sprintf($img_check,'on').' '.
	sprintf(__('File %s is writable.'),'conf/UPDATE').
	'</p>'
	);
} else {
	buffer::str(
	'<p>'.sprintf($img_check,'off').' '.
	sprintf(__('File %s is not writable.'),'conf/UPDATE').
	'</p>'
	);
}

if (is_writable(dc_img_root)) {
	buffer::str(
	'<p>'.sprintf($img_check,'on').' '.
	sprintf(__('Directory %s is writable.'),dc_img_root).
	'</p>'
	);
} else {
	buffer::str(
	'<p>'.sprintf($img_check,'off').' '.
	sprintf(__('Directory %s is not writable.'),dc_img_root).
	'</p>'
	);
}

if (is_writable(dirname(__FILE__).'/../../../themes')) {
	buffer::str(
	'<p>'.sprintf($img_check,'on').' '.
	sprintf(__('Directory %s is writable.'),'themes/').
	'</p>'
	);
} else {
	buffer::str(
	'<p>'.sprintf($img_check,'off').' '.
	sprintf(__('Directory %s is not writable.'),'themes/').
	'</p>'
	);
}

if (is_writable(dirname(__FILE__).'/../')) {
	buffer::str(
	'<p>'.sprintf($img_check,'on').' '.
	sprintf(__('Directory %s is writable.'),DC_ECRIRE.'/tools').
	'</p>'
	);
} else {
	buffer::str(
	'<p>'.sprintf($img_check,'off').' '.
	sprintf(__('Directory %s is not writable.'),DC_ECRIRE.'/tools').
	'</p>'
	);
}

if (is_writable(DC_SHARE_DIR)) {
	buffer::str(
	'<p>'.sprintf($img_check,'on').' '.
	sprintf(__('Directory %s is writable.'),'share/').
	'</p>'
	);
} else {
	buffer::str(
	'<p>'.sprintf($img_check,'off').' '.
	sprintf(__('Directory %s is not writable.'),'share/').
	'</p>'
	);
}

if (!defined('DC_UPDATE_FILE_W') || !DC_UPDATE_FILE_W) {
	buffer::str(
	'<p><strong>'.__('Important').'&nbsp;:</strong> '.
	sprintf(__('the file %s is not writable. While this does not prevent '.
	'DotClear from running, you should consider changing this for performance '.
	'reasons (HTTP cache).'),'conf/UPDATE')
	);
}

buffer::str(
'<h3>'.__('Server informations').'</h3>'.
'<p>'.sprintf(__('Your PHP version is %s'),'<strong>'.phpversion().'</strong>').'</p>'
);


if (($rs = $con->select('SELECT VERSION() AS version')) !== false)
{
	$mysql_version = preg_replace('/-log$/','',$rs->f(0));
	buffer::str(
	'<p>'.sprintf(__('Your MySQL version is %s'),
	'<strong>'.preg_replace('/-log$/','',$rs->f(0)).'</strong>').'</p>'
	);
	
	$mysql_version = preg_replace('/-log$/','',$rs->f(0));
}

if (!empty($_SERVER["SERVER_SOFTWARE"])) {
	buffer::str(
	'<p>'.sprintf(__('Your Web server is %s'),
	'<strong>'.$_SERVER["SERVER_SOFTWARE"].'</strong>').'</p>'
	);
}



?>
