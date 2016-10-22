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

require dirname(__FILE__).'/inc/prepend.php';

$auth->check(1);

include dirname(__FILE__).'/inc/connexion.php';

if (!empty($_GET['logout'])) {
	$blog->tiggerLog('','','Logout');
	$_SESSION = array();
	session_unset();
	session_destroy();
	setcookie(session_name(),'',0,'/');
	setcookie('dc_admin', NULL, strtotime('-1 hour'),dc_app_url);
	header('Location: index.php');
	exit;
}

$q = (!empty($_GET['q'])) ? $_GET['q'] : '';

# Sous menu
$mySubMenu->addItem(
	'<strong>'.__('New entry').'</strong>',array('poster.php','accesskey="n"'),'images/ico_edit.png',false);
$mySubMenu->addItem(
	__('Manage images'),'images.php','images/ico_image.png',false);
$mySubMenu->addItem(
	__('View blog'),dc_blog_url,'images/ico_goto.png',false);

# Les catégories du blog
$cat_id = (!empty($_GET['cat_id'])) ? $_GET['cat_id'] : '';

$rsCat = $blog->getCat();

$arry_cat['&nbsp;'] = NULL;
while (!$rsCat->EOF())
{
	$arry_cat[$rsCat->f('cat_libelle').
			' ['.$rsCat->f('nb_post').']'] = $rsCat->f('cat_id');
	$rsCat->moveNext();
}

# Tableau des mois du blog
$arry_months = array();
foreach ($blog->getAllDates('m','','','',$cat_id) as $k => $v) {
	$arry_months[dt::str('%B %Y',$k)] = date('Ym',$k);
}

# Determiner $y et $m les dates de la page
if (!empty($_GET['m']) && in_array($_GET['m'],$arry_months)) {
	$m = substr($_GET['m'],4);
	$y = substr($_GET['m'],0,4);
} else {
	$my_dt = $blog->getEarlierDate($cat_id);
	$my_dt = (empty($my_dt)) ? time() : strtotime($my_dt);
	$m = $y = '';
}

# Les billets (et titre)
if ($q != '')
{
	$posts = $blog->searchPost($q);
	$nb_res = $posts->nbRow();
	
	if ($nb_res > 1) {
		$subtitle = sprintf(__('%1$d entries match your search of %2$s.'),
		$nb_res,'<em>'.htmlspecialchars($q).'</em>');
	} else {
		$subtitle = sprintf(__('%1$d entrie matches search of %2$s.'),
		$nb_res,'<em>'.htmlspecialchars($q).'</em>');
	}
}
elseif (isset($_GET['offline'])) {
	$blog->setPubMode(0);
	$posts = $blog->getLastNews(NULL,'','post_dt DESC');
	$subtitle = __('Offline entries.');
}
elseif (isset($_GET['selected'])) {
	$posts = $blog->getLastNews(NULL,'','post_dt DESC',true);
	$subtitle = __('Selected entries.');
}
elseif ($m == '' && $y == '')
{
	$posts = $blog->getLastNews(15,$cat_id,'post_dt DESC');
	$subtitle = sprintf(__('Last %d entries.'),15);
}
else
{
	$posts = $blog->getPostByDate($y,$m,'',$cat_id,'post_dt DESC');
}

$h_script = '';
if (!$posts->isEmpty()) {
	$h_script =
	'<script type="text/javascript">'."\n".
	"var js_post_ids = new Array('".implode("','",$posts->getIDs('content'))."');\n".
	//"window.onload = function() { mOpenClose(js_post_ids,-1); }\n".
	"</script>\n";
}

openPage(__('Entries'),$h_script);

echo '<h2>'.__('List of entries').'</h2>';

# Formulaire avec les mois et les catégories
echo
'<form action="index.php" class="clear"><p>'.
'<label for="m" style="display:inline;"><strong>'.__('Month').' : </strong></label>'.
form::combo('m',array_merge(array(''=>''),$arry_months),$y.$m).
' <label for="cat_id" style="display:inline;"><strong>'.__('Category').' : </strong></label>'.
form::combo('cat_id',$arry_cat,$cat_id).
' <input class="submit" type="submit" value="'.__('ok').'" />'.
'</p></form>';

# Affichage des mois suivants et précédents
if(!empty($arry_months) && $m != '' && $y != '')
{
	$m_invert = array_flip($arry_months);
	$m_next = util::getNextPrev($m_invert,$y.$m,'prev');
	$m_prev = util::getNextPrev($m_invert,$y.$m,'next');
	echo '<p>';
	if($m_next) {
		echo '<a href="index.php?m='.key($m_next).'&amp;cat_id='.$cat_id.'">&#171; '.
		current($m_next).'</a> - ';
	}
	
	echo '<strong>'.$m_invert[$y.$m].'</strong>';
	if($m_prev) {
		echo ' - <a href="index.php?m='.key($m_prev).'&amp;cat_id='.$cat_id.'">'.
		current($m_prev).' &#187;</a>';
	}
	echo '</p>';
}

if (!empty($subtitle)) {
	echo '<p>'.$subtitle.'</p>';
}

# Affichage des billets
if ($posts->isEmpty())
{
	echo '<p>'.__('No entry').'.</p>';
}
else
{
	if (dc_show_previews)
	{
		echo
		'<p class="small"><a href="#" onclick="mOpenClose(js_post_ids,1); return false;">'.
		__('show all').'</a> - <a href="#" onclick="mOpenClose(js_post_ids,-1); '.
		'return false;">'.__('hide all').'</a></p>';
	}
	
	while(!$posts->EOF())
	{
		if ($posts->f('post_pub') == 0) {
			$post_cancel = __('set online');
			$post_class = 'cancel';
			$post_img = '<img src="images/check_off.png" '.
					'alt="'.__('This entry is offline').'" class="status" />';
		} else {
			$post_cancel = __('set offline');
			$post_class = 'published';
			$post_img = '<img src="images/check_on.png" '.
					'alt="'.__('This entry is online').'" class="status" />';
		}
		
		if ($posts->f('post_selected') == 1) {
			$post_selected = '<img src="images/selected.png" '.
					'alt="'.__('This entry is selected').'" class="status" />';
		} else {
			$post_selected = '';
		}
		
		$nb_comments = $posts->getNbComments();
		$nb_trackbacks = $posts->getNbTrackbacks();
		
		# Liens pour l'édition et mise hors ligne accesibles uniquement au
		# propriétaire du billet ou à un admin
		if ($_SESSION['sess_user_level'] == 9 || $posts->f('user_id') == $_SESSION['sess_user_id']) {
			$edit_links = '[ <strong><a href="poster.php?post_id='.$posts->f('post_id').'">'.
			__('edit').'</a></strong> | '.
			'<a href="poster.php?post_id='.$posts->f('post_id').'&amp;cancel=1">'.
			$post_cancel.'</a> ] ';
		} else {
			$edit_links = '[ <strong><a href="poster.php?post_id='.$posts->f('post_id').'">'.
			__('read').'</a></strong> ] ';
		}
		
		# Nombre de commentaires et trackbacks
		if ($nb_comments > 1) {
			$str_comments = sprintf(__('%d comments'),$nb_comments);
		} else {
			$str_comments = sprintf(__('%d comment'),$nb_comments);
		}
		
		if ($nb_trackbacks > 1) {
			$str_trackbacks= sprintf(__('%d trackbacks'),$nb_trackbacks);
		} else {
			$str_trackbacks= sprintf(__('%d trackback'),$nb_trackbacks);
		}
		
		echo
		'<div class="ligne '.$post_class.'" id="p'.$posts->f('post_id').'">'.
		'<h3 class="ligneTitre">'.
		$post_img.' '.$post_selected;
		
		if (dc_show_previews)
		{
			echo
			'<a href="#" onclick="openClose(\'content'.$posts->f('post_id').
			'\',0); return false;"><img src="images/plus.png" '.
			'id="img_content'.$posts->f('post_id').'" '.
			'alt="'.__('show/hide').'" title="'.__('show/hide').'" /></a>'.
			'&nbsp;&nbsp;';
		}
		
		echo
		$posts->f('post_titre').'</h3>'.
		
		'<p class="ligneInfo">'.
		'<strong>'.date('d/m/Y @ H:i:s',$posts->getTS()).'</strong> '.
		$edit_links.
		'<a href="poster.php?post_id='.$posts->f('post_id').'#comments">'.
		$str_comments.
		'</a> - '.
		'<a href="poster.php?post_id='.$posts->f('post_id').'#trackbacks">'.
		$str_trackbacks.
		'</a></p>'.
		'<p class="ligneInfo">'.
		sprintf(__('by %s - in %s'),'<strong>'.$posts->getUserCN().'</strong>',
		'<strong>'.$posts->f('cat_libelle').'</strong>').
		'</p>'.
			
		'<div id="content'.$posts->f('post_id').'" class="preview" style="display:none">';
		
		if (dc_show_previews) {
			echo
			(($posts->f('post_chapo')!='') ? $posts->f('post_chapo').'<hr class="thin" />' : '').
			$posts->f('post_content');
		}
			
		echo '</div>'.
			'</div>';
		
		$posts->moveNext();
	}
}

echo
'<form action="index.php"><p>'.
'<label for="q" style="display:inline;">'.__('Search').' : </label> '.
form::field('q',20,'',htmlspecialchars($q)).
' <input class="submit" type="submit" value="'.__('ok').'" /></p></form>';

if (count($_GET) == 0)
{
	echo
	'<ul>'.
	'<li><a href="index.php?offline=1">'.__('View all offline entries').'</a></li>'.
	'<li><a href="index.php?selected=1">'.__('View all selected entries').'</a></li>'.
	'</ul>';
	
	echo
	'<h3>'.__('Bookmarklet').'</h3>'.
	'<p>'.__('You can drag the following link to your links bar or add it to your '.
	'bookmarks and when you "Blog this!" it will open up a popup window with '.
	'information and a link to the site you\'re currently browsing so you can make '.
	'a quick post about it.').'</p>';
	
	if (substr($_SERVER['REQUEST_URI'],-1) == '/') {
		$post_url = $_SERVER['REQUEST_URI'].'poster.php';
	} else {
		$post_url = dirname($_SERVER['REQUEST_URI']).'/poster.php';
	}
	$post_url = util::getHost().$post_url;
	
	$bkm1 =
	"javascript:if(navigator.userAgent.indexOf('Safari') >= 0){".
		"Q=getSelection();".
	"}else{".
		"Q=document.selection?document.selection.createRange().text:document.getSelection();".
	"}".
	"void(window.open(".
	"'".$post_url."?dcb=1'+'".
	"&ptext='+escape(Q)+'".
	"&purl='+escape(location.href)+'".
	"&ptitle='+escape(document.title),".
	"'DotClear bookmarklet',".
	"'resizable=yes,scrollbars=yes,width=700,height=460,left=100,top=150,status=yes'));";
	
	echo '<p><a href="'.$bkm1.'">Blog this! - '.dc_blog_name.'</a></p>';
}

closePage();
?>