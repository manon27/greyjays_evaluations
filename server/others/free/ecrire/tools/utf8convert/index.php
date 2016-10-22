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

function conversionError($err)
{
	buffer::str('<p>'.__('Error(s)').' : '.$err.'</p>');
}

$dc_ini_file = dirname(__FILE__).'/../../../conf/dotclear.ini';

$err = '';

buffer::str(
'<h2>'.__('UTF-8 conversion').'</h2>'
);

$step = (!empty($_GET['step'])) ? $_GET['step'] : 1;

if (!is_writable($dc_ini_file))
{
	buffer::str(
	'<p>'.sprintf(__('Config file %s, is not writable.'),'<strong>conf/dotclear.ini</strong>').'</p>'
	);
}
elseif (dc_encoding == 'UTF-8' && $step != 7)
{
	buffer::str(
	'<p>'.__('Your blog is still in UTF-8.').'</p>'
	);
}
else
{
	if ($step == 1)
	{
		buffer::str(
		'<h3>'.__('Please read carrefully').'</h3>'.
		
		'<p>'.__('If you still did the conversion, don\'t do it again.').'</p>'.
		'<p><strong>'.__('BACKUP YOUR DATABASE ! That\'s not an advise, that\'s an order ;-)').'</strong></p>'.
		'<p><a href="tools.php?p=utf8convert&amp;step=2">'.__('Next step').'</a></p>'
		);
	}
	elseif ($step == 2)
	{
		buffer::str(
		'<h3>'.__('Converting entries').'</h3>'
		);
		
		$strReq = 'SELECT post_id, user_id, post_titre, post_chapo, post_chapo_wiki, '.
				'post_content, post_content_wiki, post_notes '.
				'FROM '.DB_PREFIX.'post ';
		$rs = $con->select($strReq);
		
		while (!$rs->EOF())
		{
			$updReq = 'UPDATE '.DB_PREFIX.'post SET '.
					'user_id = \''.$con->escapeStr(util::latin1utf8($rs->f('user_id'))).'\', '.
					'post_titre = \''.$con->escapeStr(util::latin1utf8($rs->f('post_titre'))).'\', '.
					'post_chapo = \''.$con->escapeStr(util::latin1utf8($rs->f('post_chapo'))).'\', '.
					'post_chapo_wiki = \''.$con->escapeStr(util::latin1utf8($rs->f('post_chapo_wiki'))).'\', '.
					'post_content = \''.$con->escapeStr(util::latin1utf8($rs->f('post_content'))).'\', '.
					'post_content_wiki = \''.$con->escapeStr(util::latin1utf8($rs->f('post_content_wiki'))).'\', '.
					'post_notes = \''.$con->escapeStr(util::latin1utf8($rs->f('post_notes'))).'\' '.
					'WHERE post_id = '.$rs->f('post_id').' ';
			
			if ($con->execute($updReq) === false) {
				$err = $con->error();
				break(1);
			}
			
			$rs->moveNext();
		}
		
		if ($err != '') {
			conversionError($err);
		} else {
			buffer::str(
			'<p>'.__('Entries successfully converted.').'</p>'.
			'<p><a href="tools.php?p=utf8convert&amp;step=3">'.__('Next step').'</a></p>'
			);
		}
	}
	elseif ($step == 3)
	{
		buffer::str(
		'<h3>'.__('Converting categories').'</h3>'
		);
		
		$strReq = 'SELECT cat_id, cat_libelle, cat_desc '.
				'FROM '.DB_PREFIX.'categorie ';
		$rs = $con->select($strReq);
		
		while (!$rs->EOF())
		{
			$updReq = 'UPDATE '.DB_PREFIX.'categorie SET '.
					'cat_libelle = \''.$con->escapeStr(util::latin1utf8($rs->f('cat_libelle'))).'\', '.
					'cat_desc = \''.$con->escapeStr(util::latin1utf8($rs->f('cat_desc'))).'\' '.
					'WHERE cat_id = '.$rs->f('cat_id').' ';
			
			if ($con->execute($updReq) === false) {
				$err = $con->error();
				break(1);
			}
			
			$rs->moveNext();
		}
		
		if ($err != '') {
			conversionError($err);
		} else {
			buffer::str(
			'<p>'.__('Categories successfully converted.').'</p>'.
			'<p><a href="tools.php?p=utf8convert&amp;step=4">'.__('Next step').'</a></p>'
			);
		}
	}
	elseif ($step == 4)
	{
		buffer::str(
		'<h3>'.__('Converting comments').'</h3>'
		);
		
		$strReq = 'SELECT comment_id, comment_auteur, comment_email, comment_site, '.
				'comment_content '.
				'FROM '.DB_PREFIX.'comment';
		$rs = $con->select($strReq);
		
		while (!$rs->EOF())
		{
			$updReq = 'UPDATE '.DB_PREFIX.'comment SET '.
					'comment_auteur = \''.$con->escapeStr(util::latin1utf8($rs->f('comment_auteur'))).'\', '.
					'comment_email = \''.$con->escapeStr(util::latin1utf8($rs->f('comment_email'))).'\', '.
					'comment_site = \''.$con->escapeStr(util::latin1utf8($rs->f('comment_site'))).'\', '.
					'comment_content = \''.$con->escapeStr(util::latin1utf8($rs->f('comment_content'))).'\' '.
					'WHERE comment_id = '.$rs->f('comment_id').' ';
			
			if ($con->execute($updReq) === false) {
				$err = $con->error();
				break(1);
			}
			
			$rs->moveNext();
		}
		
		if ($err != '') {
			conversionError($err);
		} else {
			buffer::str(
			'<p>'.__('Comments successfully converted.').'</p>'.
			'<p><a href="tools.php?p=utf8convert&amp;step=5">'.__('Next step').'</a></p>'
			);
		}
	}
	elseif ($step == 5)
	{
		buffer::str(
		'<h3>'.__('Converting users').'</h3>'
		);
		
		$strReq = 'SELECT user_id, user_nom, user_prenom, user_pseudo, '.
				'user_email '.
				'FROM '.DB_PREFIX.'user ';
		$rs = $con->select($strReq);
		
		while (!$rs->EOF())
		{
			$updReq = 'UPDATE '.DB_PREFIX.'user SET '.
					'user_id = \''.$con->escapeStr(util::latin1utf8($rs->f('user_id'))).'\', '.
					'user_nom = \''.$con->escapeStr(util::latin1utf8($rs->f('user_nom'))).'\', '.
					'user_prenom = \''.$con->escapeStr(util::latin1utf8($rs->f('user_prenom'))).'\', '.
					'user_pseudo = \''.$con->escapeStr(util::latin1utf8($rs->f('user_pseudo'))).'\', '.
					'user_email = \''.$con->escapeStr(util::latin1utf8($rs->f('user_email'))).'\' '.
					'WHERE user_id = \''.$con->escapeStr($rs->f('user_id')).'\' ';
			
			if ($con->execute($updReq) === false) {
				$err = $con->error();
				break(1);
			}
			
			$rs->moveNext();
		}
		
		if ($err != '') {
			conversionError($err);
		} else {
			buffer::str(
			'<p>'.__('Users successfully converted.').'</p>'.
			'<p><a href="tools.php?p=utf8convert&amp;step=6">'.__('Next step').'</a></p>'
			);
		}
	}
	elseif ($step == 6)
	{
		buffer::str(
		'<h3>'.__('Converting links').'</h3>'
		);
		
		$strReq = 'SELECT link_id, label, title '.
				'FROM '.DB_PREFIX.'link ';
		$rs = $con->select($strReq);
		
		while (!$rs->EOF())
		{
			$updReq = 'UPDATE '.DB_PREFIX.'link SET '.
					'label = \''.$con->escapeStr(util::latin1utf8($rs->f('label'))).'\', '.
					'title = \''.$con->escapeStr(util::latin1utf8($rs->f('title'))).'\' '.
					'WHERE link_id = '.$con->escapeStr($rs->f('link_id')).' ';
			
			if ($con->execute($updReq) === false) {
				$err = $con->error();
				break(1);
			}
			
			$rs->moveNext();
		}
		
		if ($err != '') {
			conversionError($err);
		} else {
			buffer::str(
			'<p>'.__('Links successfully converted.').'</p>'.
			'<p><a href="tools.php?p=utf8convert&amp;step=7">'.__('Next step').'</a></p>'
			);
		}
	}
	elseif ($step == 7)
	{
		# Ecriture du dotclear.ini
		$objIni = new iniFile($dc_ini_file);
		$objIni->editVar('dc_encoding','UTF-8');
		$objIni->saveFile();
		
		buffer::str(
		'<p>'.__('UTF-8 conversion of your blog is finished.').'</p>'
		);
	}
}

?>
