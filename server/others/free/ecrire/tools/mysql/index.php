<?php
# ***** BEGIN LICENSE BLOCK *****
# This file is part of DotClear.
# Copyright (c) 2004-2005 Olivier Meunier and contributors. All rights
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
$my_name = 'mysql';
$url = 'tools.php?p='.$my_name;

$img_check = 'images/check_%s.png';

$optimize = (!empty($_GET['optimize'])) ? $_GET['optimize'] : '';
$backup = (!empty($_POST['backup'])) ? $_POST['backup'] : '';
$restore = (!empty($_POST['restore'])) ? $_POST['restore'] : '';


// Optimisation des tables
if ($optimize == 1)
{
	buffer::str('<h2>'.__('Optimization').'</h2>');

	if ($blog->optimize() !== false) {
		buffer::str(
		'<p><img src="'.sprintf($img_check,'on').'" alt="ok" /> '.
		__('Optimize tables').'</p>'
		);
	} else {
		buffer::str(
		'<p><img src="'.sprintf($img_check,'off').'" alt="ok" /> '.
		__('Error during tables optimization').'</p>'
		);
	}

	$blog->countAll();
	buffer::str(
	'<p><img src="'.sprintf($img_check,'on').'" alt="ok" /> '.
	__('Count comments').'</p>'
	);

	buffer::str(
	'<p>'.__('Optimization done').'</p>'.
	'<p><a href="tools.php">'.__('Back to tools').'</a></p>'
	);
}
// Sauvegarde des tables
elseif ($backup == 1)
{
	include_once(dirname(__FILE__).'/lib.mysqldump.php');

	$send_it = isset($_POST['sendit'])?true:false;
	$res = dbdump::saveDump($send_it);

	buffer::str('<h2>'.__('Backup').'</h2>');
	if ($res !== false) {
		buffer::str(
			'<p><img src="'.sprintf($img_check,'on').'" alt="ok" /> '.
			__('Your tables have been saved').'</p>'.
			'<p>'. __('You can now download a gzipped version of the corresponding SQL file from this location') .
			' : <a href="'.dc_app_url.'/share/mysql/'.$res.'">'.$res.'</a></p>'.
			'<p>'.__('Backup done').'</p>'
		);
	} else {
		buffer::str(
			'<p><img src="'.sprintf($img_check,'off').'" alt="ok" /> '.
			__('Error during tables backup').'</p>'.
			'<p>'.__('Backup done').'</p>'
		);
	}
	buffer::str(
		'<p><a href="tools.php">'.__('Back to tools').'</a></p>'
	);
}
// Restauration des tables
elseif ($restore == 1)
{
	include_once(dirname(__FILE__).'/lib.mysqldump.php');

	buffer::str('<h2>'.__('Restore').'</h2>');

	if (isset($_FILES['dumpfile']) && $_FILES['dumpfile']['error'] == 0) {
		if (is_uploaded_file($_FILES['dumpfile']['tmp_name'])) {
			$tmp_file = DC_SHARE_DIR.'/mysql/dump.tmp';
			if (!move_uploaded_file($_FILES['dumpfile']['tmp_name'],$tmp_file)) {
				return(false);
			}
			$src_file = $tmp_file;
		}
		switch($_FILES['dumpfile']['type']) {
			case '' :
			case 'application/octet-stream' :
				if ($fh = fopen($src_file, "rb")) {
					$buffer = fread($fh, 3);
					fclose($fh);
					$compressed = ($buffer[0] == chr(31) && $buffer[1] == chr(139))?true:false;
				} else {
					$error = __('Cannot read uploaded file');
					@unlink($src_file);
				}
				break;
			case 'application/x-gzip':
			case 'application/x-gzip-compressed':
				$compressed = true;
				break;
			case 'text/plain':
				$compressed = false;
				break;
			default :
				$error = __('Wrong file format.');
				@unlink($src_file);
				break;
		}
	} else {
		$error = __('An error occurred while uploading the dumpfile.');
	}
	if (isset($compressed)) {
		if (($res = dbdump::restoreDump($src_file, $compressed)) !== false) {
			buffer::str(
				'<p>'.__('Restore done.').'</p>'
			);
			$blog->triggerMassUpd();
		} else {
			$error = __('An error occurred while restoring. Your blog may be broken.');
		}
	}
	if (!empty($error)) {
		buffer::str(
			'<div class="erreur"><p>'.$error.'</p></div>'.
			'<p>'.__('Restore failed.').'</p>'
		);
	}
	buffer::str(
		'<p><a href="'.$url.'">'.__('Back to menu').'</a></p>'
	);
}
else
{
	include_once(dirname(__FILE__).'/lib.installer.php');

	buffer::str(
	'<h2>'.__('MySQL database operations').'</h2>');

	// Vérification de la présence d'un répertoire dédié dans share (pour dump)
	if (($err = installer::checkPluginShareDir($my_name))) {
		buffer::str(
		'<div class="erreur"><p><strong>'.
		__('Unavailable mysql/ directory in share/. You may create it manually.').
		'</strong></p>'.
		'</div>'
		);
	}

	// Optimisation
	buffer::str(
	'<h3>'.__('Optimization').' '.helpLink('index&amp;plugin=mysql','optimisation').'</h3>'.
	'<p>'.__('This operation allows you to optimize DotClear-related tables '.
	'in MySQL and keep some data safe. No data should be lost during this '.
	'operation.').'</p>'.
	'<p><strong>'.__('Important').'</strong>&nbsp;: '.
	__('Such an operation could take some time. Please be patient.').'</p>'.
	'<p><a href="'.$url.'&amp;optimize=1">'.__('Optimize database').'</a></p>'
	);

	// Sauvegarde
	buffer::str(
	'<h3>'.__('Backup').' '.helpLink('index&amp;plugin=mysql','sauvegarde').'</h3>'.
	'<p>'.__('This operation allows you to save DotClear-related tables '.
	'in MySQL. It will generate a gzipped SQL file, stored in your share/ directory, which could be use to restore your tables and their content.').
	'</p>'.
	'<p><strong>'.__('Important').'</strong>&nbsp;: '.
	__('Such an operation could take some time. Please be patient.').'</p>'.
	'<form method="post" action="'.$url.'">'.
	'<fieldset>'.
	'<p class="field"><label class="float" for="sendit">'.__('Immediate download').' '.helpLink('index&amp;plugin=mysql','send_it').'</label>'.
	'<input type="checkbox" name="sendit" id="sendit" value="1" checked="checked" /></p>'.
	'<p class="field"><input type="hidden" name="backup" value="1"/>'.
	'<input type="submit" class="submit" value="'.__('Backup').'"/></p>'.
	'</fieldset>'.
	'</form>'
	);

	// Restauration
	buffer::str(
	'<h3>'.__('Restore a backup').' '.helpLink('index&amp;plugin=mysql','restauration').'</h3>'.
	'<p>'.__('This operation allows you to restore your DotClear-related tables in MySQL. '.
	'It will use a gzipped dump file produced by the backup operation.').'</p>'.
	'<p>'.__('Use the form below to select and upload your dump file.').'</p>'.
	'<p><strong>'.__('Important').'</strong>&nbsp;: '.
	__('Such an operation could take some time. Please be patient.').'</p>'.
	'<p class="erreur"><strong>'.
	__('Please note that this operation will not merge existing datas with dumped ones, but simply replace them.').
	'<br />'.
	__('Besides, this process can fail due to execution time restrictions in your PHP configuration.').
	__('In such a case, it may leave your blog in a damaged state.').
	'<br />'.
	__('You are now warned !').
	'</strong></p>'.
	'<form method="post" action="'.$url.'" enctype="multipart/form-data">'.
	'<fieldset>'.
	'<p class="field"><label class="float" for="dumpfile">'.__('Dumpfile to restore').' '.helpLink('index&amp;plugin=mysql','dumpfile').'</label>'.
	'<input type="file" name="dumpfile" id="dumpfile"/></p>'.
	'<p class="field"><input type="hidden" name="restore" value="1"/>'.
	'<input type="submit" class="submit" value="'.__('Restore').'"/></p>'.
	'</fieldset>'.
	'</form>'
	);
}
?>
