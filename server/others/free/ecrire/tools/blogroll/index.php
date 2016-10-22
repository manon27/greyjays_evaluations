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

/* Small note on design:
 * 
 * Both links and categories are stored in the same database table.
 * The difference is that 'label' and 'href' fields are empty for categories.
 *
 * This is quite hacky but perfectly fits a simple two level design.
 *
 */ 

require dirname(__FILE__).'/class.blogroll.php';

$url = 'tools.php?p=blogroll';
$icon = 'tools/blogroll/icon_small.png';

$PLUGIN_HEAD =
'<style type="text/css">'."\n".
'.sort img.status {float: right; margin: 2px 0 0 4px; position: relative;}'."\n".
'</style>'."\n".
'<script type="text/javascript" src="js/drag.js"></script>'.
'<script type="text/javascript" src="js/dragsort.js"></script>'.
'<script type="text/javascript">'."\n".
'  if (document.getElementById) { '."\n".
'    window.onload = function() { '."\n".
'    dragSort.dest = document.getElementById(\'dndSort\');'."\n".
'    dragSort.makeElementSortable(document.getElementById(\'sortlinks\'));'."\n".
'    };'."\n".
'  }'."\n".
'</script>';

$blogroll = new blogroll($blog,DB_PREFIX);

$action = !empty($_REQUEST['action']) ? $_REQUEST['action'] : NULL;
$page = !empty($_REQUEST['page']) ? $_REQUEST['page'] : NULL;
$err = '';

if ($page == 'edit_link' && !empty($_REQUEST['id']))
{
	include dirname(__FILE__).'/edit_link.php';
}
elseif ($page == 'edit_cat' && !empty($_REQUEST['id']))
{
	include dirname(__FILE__).'/edit_cat.php';
}
else
{
	$l_label = $l_title = $l_href = $l_lang = '';
	$c_title = '';
	
	# Ajout d'un lien
	if ($action == 'add_link')
	{
		$l_label = trim($_POST['l_label']);
		$l_title = trim($_POST['l_title']);
		$l_href = trim($_POST['l_href']);
		$l_lang = trim($_POST['l_lang']);
		
		if (!$l_label || !$l_href)
		{
			$err = __('You must provide at least a label and an URL');
		}
		else
		{
			if ($blogroll->addLink($l_label,$l_href,$l_title,$l_lang) == false) {
				$err = $blogroll->con->error();
			} else {
				header('Location: '.$url);
				exit;
			}
		}
	}
	# Ajout d'un catégorie
	elseif ($action == 'add_cat')
	{
		$c_title = trim($_POST['c_title']);
		
		if ($c_title)
		{
			if ($blogroll->addCat($c_title) == false) {
				$err = $blogroll->con->error();
			} else {
				header('Location: '.$url);
				exit;
			}
		}
	}
	# Suppression
	elseif ($action == 'delete' && !empty($_GET['id']))
	{
		if ($blogroll->delEntry($_GET['id']) == false) {
			$err = $blogroll->con->error();
		} else {
			header('Location: '.$url);
			exit;
		}
	}
	# Classic ord
	if (isset($_POST['linkOrd']) && is_array($_POST['linkOrd']))
	{
		if ($blogroll->ordEntries($_POST['linkOrd']) === false) {
			$err = $blogroll->con->error();
		} else {
			header('Location: '.$url);
			exit;
		}
	}
	# DragNdrop
	if (!empty($_POST['dndSort']))
	{
		$linkOrd = array();
		foreach (explode(';',$_POST['dndSort']) as $k => $v) {
			$linkOrd[substr($v,3)] = $k;
		}
		
		if ($blogroll->ordEntries($linkOrd) === false) {
			$err = $blogroll->con->error();
		} else {
			header('Location: '.$url);
			exit;
		}
	}
	
	
	# Affichage ---
	buffer::str('<h2>'.__('Links manager').'</h2>');
	
	if ($err != '') {
		buffer::str(
		'<div class="erreur"><p><strong>'.__('Error(s)').' :</strong></p>'.
		'<p>'.$err.'</p>'.
		'</div>'
		);
	}
	
	$strReq = 'SELECT link_id, label, href, title, lang, position '.
			'FROM '.$blogroll->table.' '.
			'ORDER BY position ';
	
	$rs = $con->select($strReq);
	
	buffer::str(
	'<p>'.__('Drag items to change their positions.').'</p>'.
	'<form action="'.$url.'" method="post">'.
	'<div id="sortlinks">'
	);
	while ($rs->fetch())
	{
		$link_id = $rs->f('link_id');
		$link_ord = $rs->f('position');
		
		$is_cat = !$rs->f('label') && !$rs->f('href');
		
		$i_label = ($is_cat) ? $rs->f('title') : $rs->f('label');
		
		if ($is_cat) {
			$del_msg = __('Are you sure you want to delete this category?');
		} else {
			$del_msg = sprintf(__('Are you sure you want to delete this %s?'),__('link'));
		}
		
		buffer::str('<div class="sort" id="dnd'.$link_id.'">');
		
		buffer::str(
		'<p>'.($is_cat ? '<strong>' : '').
		'<a href="'.$url.'&amp;action=delete&amp;id='.$link_id.'" '.
		'onclick="return window.confirm(\''.addslashes($del_msg).'\')">'.
		'<img src="images/delete.png" alt="'.__('delete').'" '.
		'title="'.__('delete').'" class="status" /></a>'
		);
		
		
		if ($is_cat) {
			buffer::str('<a href="'.$url.'&amp;id='.$link_id.'&amp;page=edit_cat">'.
			$i_label.'</a>');
		} else {
			buffer::str('<a href="'.$url.'&amp;id='.$link_id.'&amp;page=edit_link">'.
			$i_label.'</a>');
		}
		
		buffer::str(($is_cat ? '</strong>' : '').'</p>');
		
		if (!$is_cat)
		{
			buffer::str(
			'<p>'.
			htmlspecialchars($rs->f('href')).
			' - '.$rs->f('title').
			' ('.$rs->f('lang').')'.
			'</p>'
			);
		}
		
		buffer::str(
		'<p class="nojsfield"><label for="linkOrd'.$link_id.'" class="inline">'.__('Position').' : </label>'.
		form::field(array('linkOrd['.$link_id.']','linkOrd'.$link_id),3,3,$link_ord).'</p>'
		);
		
		buffer::str('</div>');
	}
	buffer::str(
	'</div>'.
	'<p><input type="hidden" id="dndSort" name="dndSort" value="" />'.
	'<input type="submit" class="submit" value="'.__('save order').'" /></p>'.
	'</form>'
	);
	
	buffer::str(
	'<form action="'.$url.'" method="post">'.
	'<fieldset><legend>'.__('New link').'</legend>'.
	'<p class="field"><strong>'.
	'<label for="l_label" class="float">'.__('Label').' : </label></strong>'.
	form::field('l_label',40,255,htmlspecialchars($l_label)).'</p>'.
	
	'<p class="field"><strong>'.
	'<label for="l_href" class="float">'.__('URL').' : </label></strong>'.
	form::field('l_href',40,255,htmlspecialchars($l_href)).'</p>'.
	
	'<p class="field">'.
	'<label for="l_title" class="float">'.__('Description').' ('.__('optional').') : </label>'.
	form::field('l_title',40,255,htmlspecialchars($l_title)).'</p>'.
	
	'<p class="field">'.
	'<label for="l_lang" class="float">'.__('Language').' ('.__('optional').') : </label>'.
	form::field('l_lang',2,2,htmlspecialchars($l_lang)) . '</p>'.
	
	'<p>'.form::hidden('action','add_link').
	'<input type="submit" class="submit" value="'.__('save').'"/></p>'.
	'</fieldset>'.
	'</form>'
	);
	
	buffer::str(
	'<form action="'.$url.'" method="post">'.
	'<fieldset><legend>'.__('New rubric').'</legend>'.
	'<p class="field"><strong>'.
	'<label for="c_title" class="float">'.__('Title').' : </label></strong>'.
	form::field('c_title',40,255,htmlspecialchars($c_title)).'</p>'.
	
	'<p>'.form::hidden('action','add_cat').
	'<input type="submit" class="submit" value="'.__('save').'"/></p>'.
	'</fieldset>'.
	'</form>'
	);
	
	buffer::str(
	'<h3>'.__('Usage').'</h3>'.
	'<p>'.__('To replace your static blogroll by this one, just put the '.
	'following code in your template:').'</p>'.
	'<pre>&lt;?php dcBlogroll::linkList(); ?&gt;</pre>'
	);
}
?>
