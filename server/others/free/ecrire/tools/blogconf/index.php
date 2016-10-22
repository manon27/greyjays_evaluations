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

$dc_ini_file = dirname(__FILE__).'/../../../conf/dotclear.ini';

$err = '';

$url = 'tools.php?p=blogconf';
$is_writable = false;


if (!is_writable($dc_ini_file)) {
	$err = '<p>'.sprintf(__('Config file %s, is not writable.'),'<strong>conf/dotclear.ini</strong>').'</p>';
} else {
	$is_writable = true;
	
	# Modification du fichier
	if (!empty($_POST))
	{
		$p_blog_name = trim($_POST['p_blog_name']);
		$p_blog_desc = trim($_POST['p_blog_desc']);
		$p_blog_url = trim($_POST['p_blog_url']);
		$p_app_url = trim($_POST['p_app_url']);
		$p_img_url = trim($_POST['p_img_url']);
		$p_blog_rss = trim($_POST['p_blog_rss']);
		$p_blog_atom = trim($_POST['p_blog_atom']);
		$p_trackback_uri = trim($_POST['p_trackback_uri']);
		$p_url_scan = trim($_POST['p_url_scan']);
		$p_nb_post_per_page = trim($_POST['p_nb_post_per_page']);
		$p_show_previews = trim($_POST['p_show_previews']);
		$p_date_format = trim($_POST['p_date_format']);
		$p_time_format = trim($_POST['p_time_format']);
		$p_default_lang = trim($_POST['p_default_lang']);
		$p_theme = trim($_POST['p_theme']);
		$p_allow_comments = trim($_POST['p_allow_comments']);
		$p_allow_trackbacks = trim($_POST['p_allow_trackbacks']);
		$p_comments_pub = trim($_POST['p_comments_pub']);
		$p_comments_ttl = trim($_POST['p_comments_ttl']);
		$p_comment_notification = trim($_POST['p_comment_notification']);
		$p_use_smilies = trim($_POST['p_use_smilies']);
		$p_short_feeds = trim($_POST['p_short_feeds']);
		$p_http_cache = trim($_POST['p_http_cache']);
		
		$arry_err = array();
		
		if ($p_blog_name == '') {
			$arry_err[] = __('You must give a blog name');
		}
		if ($p_blog_url == '') {
			$arry_err[] = __('You must give a blog URL');
		}
		if ($p_img_url == '') {
			$arry_err[] = __('You must give an images location');
		}
		if ($p_blog_rss == '') {
			$arry_err[] = __('You must give a RSS location');
		}
		if ($p_blog_atom == '') {
			$arry_err[] = __('You must give an Atom location');
		}
		if (!preg_match('/^[0-9]+$/',$p_nb_post_per_page) || $p_nb_post_per_page < 1) {
			$arry_err[] = __('You must give a valid number of entries per page');
		}
		
		if (count($arry_err) > 0)
		{
			$err .= '<ul>';
			foreach ($arry_err as $v) { $err .= '<li>'.$v.'</li>'; }
			$err .= '</ul>';
		}
		else
		{
			$p_blog_url = preg_replace('|^/+|','',$p_blog_url);
			$p_blog_url = '/'.$p_blog_url;
			
			$p_img_url = preg_replace('|/+$|','',$p_img_url);
			$p_img_url = preg_replace('|^/+|','',$p_img_url);
			$p_img_url = '/'.$p_img_url.'/';
			
			$objIni = new iniFile($dc_ini_file);
			$objIni->editVar('dc_blog_name',$p_blog_name);
			$objIni->editVar('dc_blog_desc',$p_blog_desc);
			$objIni->editVar('dc_blog_url',$p_blog_url);
			$objIni->editVar('dc_app_url',$p_app_url);
			$objIni->editVar('dc_img_url',$p_img_url);
			$objIni->editVar('dc_blog_rss',$p_blog_rss);
			$objIni->editVar('dc_blog_atom',$p_blog_atom);
			$objIni->editVar('dc_trackback_uri',$p_trackback_uri);
			$objIni->editVar('dc_url_scan',$p_url_scan);
			$objIni->editVar('dc_nb_post_per_page',(integer) $p_nb_post_per_page);
			$objIni->editVar('dc_show_previews',(integer) $p_show_previews);
			$objIni->editVar('dc_date_format',$p_date_format);
			$objIni->editVar('dc_time_format',$p_time_format);
			$objIni->editVar('dc_default_lang',$p_default_lang);
			$objIni->editVar('dc_theme',$p_theme);
			$objIni->editVar('dc_allow_comments',(integer) $p_allow_comments);
			$objIni->editVar('dc_allow_trackbacks',(integer) $p_allow_trackbacks);
			$objIni->editVar('dc_comments_pub',(integer) $p_comments_pub);
			$objIni->editVar('dc_comments_ttl',(integer) $p_comments_ttl);
			$objIni->editVar('dc_comment_notification',(integer) $p_comment_notification);
			$objIni->editVar('dc_use_smilies',(integer) $p_use_smilies);
			$objIni->editVar('dc_short_feeds',(integer) $p_short_feeds);
			$objIni->editVar('dc_http_cache',(integer) $p_http_cache);
			
			if ($objIni->saveFile() !== false) {
				header('Location: '.$url.'&done=1');
				exit;
			} else {
				$err = __('An error occured while writing the file.');
			}
		}
	}
}


/* Affichage
-------------------------------------------------------- */
buffer::str('<h2>'.__('DotClear configuration').'</h2>');

if($err != '')
{
	buffer::str('<div class="erreur"><p><strong>'.__('Error(s)').' :</strong></p>'.$err.'</div>');
}

if ($is_writable)
{
	# Liste des thèmes
	$themes = new plugins(dirname(__FILE__).'/../../../themes/','theme');
	$themes->getPlugins(true);
	$themes_list = $themes->getPluginsList();
	
	array_walk($themes_list,create_function('&$v','$v=$v["label"];'));
	$themes_list = array_flip($themes_list);
	
	# Liste des modes de scan
	$scan_modes = array(
	'Query string' => 'query_string',
	'Path info' => 'path_info'
	);
	
	if (!empty($_GET['done'])) {
		buffer::str(
		'<p class="message">'.__('Configuration file successfully updated.').'</p>'
		);
	}
	
	buffer::str(
	'<form action="'.$url.'" method="post">'.
	
	'<fieldset class="clear">'.
	'<legend>'.__('Base configuration').'</legend>'.
	'<p class="field"><label for="p_blog_name"><strong>'.__('Blog name').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','blog_name').'</label>'.
	form::field('p_blog_name',40,'',htmlspecialchars(dc_blog_name)).'</p>'.
	
	'<p class="field"><label for="p_blog_desc"><strong>'.__('Blog description').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','blog_desc').'</label>'.
	form::field('p_blog_desc',40,'',htmlspecialchars(dc_blog_desc)).'</p>'.
	
	'<p class="field"><label for="p_blog_url"><strong>'.__('Blog URL').'&nbsp;:</strong> '.
	'('.sprintf(__('From %s'),'http://'.$_SERVER['HTTP_HOST']).') '.
	helpLink('index&amp;plugin=blogconf','blog_url').'</label>'.
	form::field('p_blog_url',40,'',htmlspecialchars(dc_blog_url)).'</p>'.
	
	'<p class="field"><label for="p_nb_post_per_page"><strong>'.__('Number of entries per page').'&nbsp;:</strong> '.
	'('.__('first page and categories').') '.
	helpLink('index&amp;plugin=blogconf','nb_post_per_page').'</label>'.
	form::field('p_nb_post_per_page',3,'',dc_nb_post_per_page).'</p>'.
	
	'<p class="field"><label for="p_default_lang"><strong>'.__('Default language').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','default_lang').'</label>'.
	form::combo('p_default_lang',l10n::getISOcodes(1),dc_default_lang).'</p>'.
	
	'<p class="field"><label for="p_theme"><strong>'.__('Blog theme').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','theme').'</label>'.
	form::combo('p_theme',$themes_list,dc_theme).'</p>'.
	
	'<p class="field"><label for="p_allow_comments"><strong>'.
	__('Allow comments').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','allow_comments').'</label>'.
	form::combo('p_allow_comments',array(__('yes')=>1,__('no')=>0),(integer) dc_allow_comments).
	'</p>'.
	
	'<p class="field"><label for="p_allow_trackbacks"><strong>'.
	__('Allow trackbacks').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','allow_trackbacks').'</label>'.
	form::combo('p_allow_trackbacks',array(__('yes')=>1,__('no')=>0),(integer) dc_allow_trackbacks).
	'</p>'.
	
	'<p class="field"><label for="p_comments_pub"><strong>'.
	__('Publish comments immediately').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','comments_pub').'</label>'.
	form::combo('p_comments_pub',array(__('yes')=>1,__('no')=>0),(integer) dc_comments_pub).
	'</p>'.
	'</fieldset>'.
	
	'<fieldset><legend>'.__('Advanced configuration').'</legend>'.
	
	'<p class="field"><label for="p_app_url"><strong>'.__('Application location').'&nbsp;:</strong> '.
	'('.sprintf(__('From %s'),'http://'.$_SERVER['HTTP_HOST']).') '.
	helpLink('index&amp;plugin=blogconf','app_url').'</label>'.
	form::field('p_app_url',40,'',htmlspecialchars(dc_app_url)).'</p>'.
	
	'<p class="field"><label for="p_img_url"><strong>'.__('Images location').'&nbsp;:</strong> '.
	'('.sprintf(__('From %s'),'http://'.$_SERVER['HTTP_HOST']).') '.
	helpLink('index&amp;plugin=blogconf','img_url').'</label>'.
	form::field('p_img_url',40,'',htmlspecialchars(dc_img_url)).'</p>'.
	
	'<p class="field"><label for="p_blog_rss"><strong>'.__('RSS feed location').'&nbsp;:</strong> '.
	'('.sprintf(__('From %s'),'http://'.$_SERVER['HTTP_HOST']).') '.
	helpLink('index&amp;plugin=blogconf','blog_rss').'</label>'.
	form::field('p_blog_rss',40,'',htmlspecialchars(dc_blog_rss)).'</p>'.
	
	'<p class="field"><label for="p_blog_atom"><strong>'.__('Atom feed location').'&nbsp;:</strong> '.
	'('.sprintf(__('From %s'),'http://'.$_SERVER['HTTP_HOST']).') '.
	helpLink('index&amp;plugin=blogconf','blog_atom').'</label>'.
	form::field('p_blog_atom',40,'',htmlspecialchars(dc_blog_atom)).'</p>'.
	
	'<p class="field"><label for="p_trackback_uri"><strong>'.__('Trackback URL').'&nbsp;:</strong> '.
	'('.sprintf(__('From %s'),'http://'.$_SERVER['HTTP_HOST']).') '.
	helpLink('index&amp;plugin=blogconf','trackback_uri').'</label>'.
	form::field('p_trackback_uri',40,'',htmlspecialchars(dc_trackback_uri)).'</p>'.
	
	'<p class="field"><label for="p_url_scan"><strong>'.
	__('URL type').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','url_scan').'</label>'.
	form::combo('p_url_scan',$scan_modes,dc_url_scan).
	'</p>'.
	
	'<p class="field"><label for="p_show_previews"><strong>'.
	__('Preview entries in backend').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','show_previews').'</label>'.
	form::combo('p_show_previews',array(__('yes')=>1,__('no')=>0),(integer) dc_show_previews).
	'</p>'.
	
	'<p class="field"><label for="p_date_format"><strong>'.__('Date format').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','time_format').'</label>'.
	form::field('p_date_format',40,'',htmlspecialchars(dc_date_format)).'</p>'.
	
	'<p class="field"><label for="p_time_format"><strong>'.__('Time format').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','time_format').'</label>'.
	form::field('p_time_format',40,'',htmlspecialchars(dc_time_format)).'</p>'.
	
	'<p class="field"><label for="p_comments_ttl"><strong>'.
	__('Time to live of comments and trackbacks').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','comments_ttl').'</label>'.
	form::field('p_comments_ttl',3,'',(string) dc_comments_ttl).'</p>'.
	
	'<p class="field"><label for="p_use_smilies"><strong>'.
	__('Show smileys in blog entries and comments').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','use_smilies').'</label>'.
	form::combo('p_use_smilies',array(__('yes')=>1,__('no')=>0),(integer) dc_use_smilies).
	'</p>'.
	
	'<p class="field"><label for="p_comment_notification"><strong>'.
	__('Notify each new comment by email').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','comment_notification').'</label>'.
	form::combo('p_comment_notification',array(__('yes')=>1,__('no')=>0),(integer) dc_comment_notification).
	'</p>'.
	
	'<p class="field"><label for="p_short_feeds"><strong>'.
	__('Short RSS and Atom feeds').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','short_feeds').'</label>'.
	form::combo('p_short_feeds',array(__('yes')=>1,__('no')=>0),(integer) dc_short_feeds).
	'</p>'.
	
	'<p class="field"><label for="p_http_cache"><strong>'.
	__('Activate HTTP cache').'&nbsp;:</strong> '.
	helpLink('index&amp;plugin=blogconf','http_cache').'</label>'.
	form::combo('p_http_cache',array(__('yes')=>1,__('no')=>0),(integer) dc_http_cache).
	'</p>'.
	'</fieldset>'.
	
	'<p class="field"><input class="submit" type="submit" value="'.__('save').'" /></p>'.
	'</form>'
	);
}
?>
