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

$err = '';
$tool_url = '';

# Liste des thèmes
$themes_root = dirname(__FILE__).'/../../../themes';
$themes = new plugins($themes_root,'theme');
$themes->getPlugins(false);
$themes_list = $themes->getPluginsList();

$is_writable = is_writable($themes_root);

$dc_ini_file = dirname(__FILE__).'/../../../conf/dotclear.ini';
$is_ini_writable = is_writable($dc_ini_file);

# Installation d'un thème
if ($is_writable && !empty($_GET['tool_url']))
{
	$tool_url = $_GET['tool_url'];
	$parsed_url = parse_url($tool_url);
	
	if (empty($parsed_url['scheme']) || !preg_match('/^http|ftp$/',$parsed_url['scheme'])
	|| empty($parsed_url['host']) || empty($parsed_url['path']))
	{
		$err = __('URL is not valid.');
	}
	else
	{
		if (($err = $themes->install($tool_url)) === true)
		{
			header('Location: tools.php?p=thememng');
			exit;
		}
	}
}

# Utilisation d'un thème
$use = (!empty($_GET['use'])) ? $_GET['use'] : '';
if ($is_ini_writable && in_array($use,array_keys($themes_list)))
{
	$objIni = new iniFile($dc_ini_file);
	$objIni->editVar('dc_theme',$use);
	if ($objIni->saveFile() !== false) {
		header('Location: tools.php?p=thememng');
		exit;
	} else {
		$err = __('An error occured while writing configuration file.');
	}
	exit;
}

# Suppression d'un thème
$delete = (!empty($_GET['delete'])) ? $_GET['delete'] : '';

if ($is_writable && $delete != '' && in_array($delete,array_keys($themes_list)) && $delete != 'default')
{
	files::deltree($themes_root.'/'.$delete);
	header('Location: tools.php?p=thememng');
	exit;
}

if($err != '')
{
	buffer::str(
	'<div class="erreur"><p><strong>'.__('Error(s)').' :</strong></p>'.$err.'</div>'
	);
}

buffer::str(
'<h2>'.__('Themes manager').'</h2>'.
'<h3>'.__('Install a theme').'</h3>'
);

if (!$is_writable)
{
	buffer::str(
	'<p>'.sprintf(__('The folder %s is not writable, please check its permissions.'),
	'themes/').'</p>'
	);
}
else
{
	buffer::str(
	'<form action="tools.php" method="get">'.
	'<p><label for="tool_url">'.__('Please give the URL (http or ftp) of the theme\'s file').' :</label>'.
	form::field('tool_url',50,'',$tool_url).'</p>'.
	'<p><input type="submit" class="submit" value="'.__('install').'" />'.
	'<input type="hidden" name="p" value="thememng" /></p>'.
	'</form>'
	);
}

buffer::str(
'<p><a href="http://www.dotclear.net/themes/">'.__('Install new themes').'</a></p>'
);

buffer::str(
'<h3>'.__('List of installed themes').'</h3>'.
'<dl>'
);

foreach ($themes_list as $k => $v)
{
	$themes->loadl10n($k);
	
	buffer::str(
	'<dt>'.
	($k == dc_theme ? '<img src="images/selected.png" alt="'.__('Current theme').' - "/> ' : '').
	__($v['label']).' - '.$k.'</dt>'.
	'<dd>'.__($v['desc']).' <br />'.
	'par '.$v['author'].' - '.__('version').' '.$v['version'].' <br />'
	);
	
	if ($k != dc_theme) {
		if ($is_ini_writable)
		{
			buffer::str(
			'<strong><a href="tools.php?p=thememng&amp;use='.$k.'">'.
			__('use this theme').'</a></strong> - '
			);
		}
		
		if ($is_writable)
		{
			buffer::str(
			'<a href="tools.php?p=thememng&amp;delete='.$k.'" '.
			'onclick="return window.confirm(\''.__('Are you sure you want to delete this theme ?').'\')">'.
			__('delete').'</a>'
			);
		}
	}
	
	buffer::str('</dd>');
}
buffer::str('</dl>');
?>