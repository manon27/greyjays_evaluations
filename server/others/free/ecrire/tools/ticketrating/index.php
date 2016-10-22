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
/*
for x in 1 2 3 4 5 off; 
do 
	pngtogd2 $x.png $x.gd2 64 1; 
	gd2togif $x.gd2 $x.gif; 
	rm $x.gd2; 
done
*/

require_once(dirname(__FILE__).'/class/class.tr.ini.file.php');

$dc_ticketrating_ini_file = DC_SHARE_DIR.'/ticketrating/ticketrating.ini';
$img_format = array('png'=>'.png','gif'=>'.gif');

function displayCategories()
{
	global $blog,$dc_ticketrating_ini_file;

	$rs = $blog->getCat();
	$arr = $rs->getData();
	$arr_ini_cat = tr_iniFile::read($dc_ticketrating_ini_file,true);
	$selected_cat = $arr_ini_cat['selected_cat'];

	$arr_sel_cat = explode(':',$selected_cat);

	buffer::str('<form action="'.$_SERVER["REQUEST_URI"].'" method="post">');
	buffer::str('<p>');
	buffer::str('<h4>'.__('Enable vote for selected categories').'</h4>');
	buffer::str('<table>');
	foreach( $arr as $arr_cat )
	{
		$checked = false;
		if ( in_array($arr_cat['cat_id'],$arr_sel_cat,true) )
		{
			$checked = true;
		}
		buffer::str('<tr>');
		buffer::str('<td>'.form::checkbox('cat_'.$arr_cat['cat_id'],$arr_cat['cat_id'],$checked,'','cat_'.$arr_cat['cat_id']).'</td>');
		buffer::str('<td>'.$arr_cat['cat_libelle'].'</td>');
		buffer::str('</tr>');
	}
	buffer::str('</table>');
	buffer::str('<input type="submit" name="save" id="save" value="'.__('Save').'" />');
	buffer::str('</p>');
	buffer::str('</form><br />');
}

function displayThemesList()
{
	
	global $img_format;

	# Liste des thèmes
	$themes_root = dirname(__FILE__).'/../../../themes';
	$themes = new plugins($themes_root,'theme');
	$themes->getPlugins(false);
	$themes_list = $themes->getPluginsList();
	array_walk($themes_list,create_function('&$v','$v=$v["label"];'));
	$themes_list = array_flip($themes_list);

	$icons_themes_infos = getThemesInfos(dirname(__FILE__).'/images/');

	buffer::str("<form action=\"".$_SERVER['REQUEST_URI']."\" method=\"post\">\r\n");
	buffer::str("<p>".__('Install icons in selected theme')."&nbsp;:&nbsp;<br />");
	buffer::str(form::combo('p_icons',$icons_themes_infos,$icons_themes_infos)."\r\n");
	buffer::str(form::combo('p_theme',$themes_list,$themes_list)."\r\n");
	buffer::str(form::field('p_pre',5,5,'tr_').'&nbsp;');
	buffer::str(form::combo('p_ext',$img_format,$img_format)."\r\n");
	buffer::str("<input type=\"submit\" name=\"send\" id=\"send\" /></p>\r\n");
	buffer::str("</form>\r\n");

	buffer::str('<h4>' . __('List of themes and associated images') . '</h4>');
	foreach ( $icons_themes_infos as $label => $name )
	{
		buffer::str('&nbsp;&nbsp;' . $label . '<br />');
		foreach ( $img_format as $k => $v )
		{
			$img_list = listImgInIcon($name,$v);
			if ( count($img_list) > 0 )
			{
				buffer::str('&nbsp;&nbsp;'.$k.'&nbsp;&nbsp;');
				foreach($img_list as $img )
				{
					$img_link = 'tools/' .$_REQUEST["p"] . '/images/'. $name .'/'. $img;
					buffer::str('<img alt="" src=\''.$img_link . '\' />&nbsp;');
				}
			}
			buffer::str('<br />');
		}
		buffer::str('<br />');
	}
}

function displayUpdate()
{

	/* Vérifictation des mises à jour */
	$plugins_root = dirname(__FILE__).'/../';
	$plugins = new plugins($plugins_root);
	$plugins->getPlugins(false);
	$plugins_list = $plugins->getPluginsList();
	$p_info = $plugins_list['ticketrating'];
	unset($plugins_list, $plugins, $plugins_root);

	if($check = @file_get_contents("http://aureq.free.fr/ticketrating/version"))
	{
		if(checkNewVersion($p_info['version'],$check))
		{
			buffer::str('<h3>' . __('A newer version of this plugin is available!') . ' Version: '.$check.'</h3>');
			buffer::str('<img src="images/ico_goto.png" alt=""/> ');
			buffer::str('<a href="http://www.dotclear.net/trac/wiki/DotClear/Plugins" >');
			buffer::str(__('Please visit official dotclear plugins page'));
			buffer::str('</a>');
		}
		else
		{
			buffer::str('<h4><img src="images/check_on.png" alt=""/> ' . __('The current version is:') .' '. $p_info['version'] .'</h4>');
		}
	}
}
function displayChangeLog()
{
	$fname = dirname(__FILE__).'/ChangeLog';
	if ( ( filesize($fname) != FALSE ) && ( filesize($fname) > 0 ) && ( is_readable($fname) == TRUE ) )
	{
		$handle = fopen( $fname, 'r' );
		$contents = fread ($handle, filesize ($fname));
		fclose ($handle);
		buffer::str('<pre>'.$contents.'</pre>');
	}
}

function displayHelp()
{

	buffer::str('<h4>' . __('Usage') . '</h4>');
	/* fast and dirty */
	buffer::str('<p>' . __('The following templates file can be edited to use the plugin: post.php and list.php') . '</p>' .
	'<p>' . __('To show the form allowing to rate a ticket, use this: (fast and dirty)') . '</p>');

	buffer::str('<strong>'.__('Note: This method doesn\'t allow you to select categories. All are enabled !!!').'</strong><br />');

	buffer::str('<pre>' . htmlspecialchars('<?php if (is_callable(array(\'postRating\',\'getRate\'))) : ?>') . '<br />' . 
	htmlspecialchars('<script type="text/javascript" src="<?php dcInfo(\'theme\'); ?>/js/vote.js"></script>') . '<br />' . 
	htmlspecialchars('<span>-</span> <?php postRating::getRateCount(); ?> vote(s) ') . '<br />' . 
	htmlspecialchars('<?php postRating::rateIt(); ?>'). '<br />' .
	htmlspecialchars('<?php endif; ?>') . '</pre>');


	/* Methode propre */
	buffer::str('<h5>'. __('To show the form allowing to rate a ticket with category selection and nice javascript insertion, do this:') .'</h5>');

	buffer::str('<h6>'.__('Step').'1: template.php</h6>');
	buffer::str('<p>'.__('Insert the following line under the "body" tag').':');
	buffer::str('<pre>'.htmlspecialchars('<script type="text/javascript" src="<?php dcInfo(\'theme\'); ?>/js/vote.js"></script>').'</pre></p>');

	buffer::str('<h6>'.__('Step').'2: list.php & post.php</h6>');
	buffer::str('<p>'.__('Insert the following lines').':');

	buffer::str('<pre>'.htmlspecialchars('<?php if (is_callable(array(\'postRating\',\'getRate\'))) : ?>'). '<br />' .
	'&nbsp;&nbsp;&nbsp;&nbsp;' . htmlspecialchars('<?php if (postRating::isEnabledCat($news->f(\'cat_id\'))) : ?>'). '<br />' .
	'&nbsp;&nbsp;&nbsp;&nbsp;' . htmlspecialchars('<span>|</span>&nbsp;<?php postRating::getRateCount(); ?> vote(s) <?php postRating::rateIt(); ?>'). '<br />' .
	'&nbsp;&nbsp;&nbsp;&nbsp;' . htmlspecialchars('<?php endif; ?>'). '<br />' .
	htmlspecialchars('<?php endif; ?>'). '<br />' .
	'</pre>');
	buffer::str('</p>');

	buffer::str('<h4>'.__('Official release web page').'</h4>');

	buffer::str('<img src="images/ico_goto.png" alt=""/> ');
	buffer::str('<a href="http://bobcatt.menfin.net/blog/index.php/2005/11/20/326-plugin-dotclear-evaluation-de-billets-070" >');
	buffer::str('Version 0.7.0</a><br/>');

	buffer::str('<img src="images/ico_goto.png" alt=""/> ');
	buffer::str('<a href="http://bobcatt.menfin.net/blog/index.php/2005/11/12/323-plugin-dotclear-evaluation-de-billets-065" >');
	buffer::str('Version 0.6.5</a><br/>');

	buffer::str('<img src="images/ico_goto.png" alt=""/> ');
	buffer::str('<a href="http://bobcatt.menfin.net/blog/index.php/2005/10/23/316-plugin-dotclear-evaluation-de-billets-062" >');
	buffer::str('Version 0.6.2</a><br />');

	buffer::str('<h4>'.__('Support forum').'</h4>');

	buffer::str('<img src="images/ico_goto.png" alt=""/> ');
	buffer::str('<a href="http://www.dotclear.net/forum/viewtopic.php?pid=60914" >Version 0.7.0</a><br />');

	buffer::str('<img src="images/ico_goto.png" alt=""/> ');
	buffer::str('<a href="http://www.dotclear.net/forum/viewtopic.php?pid=59462" >Version 0.6.5</a><br />');

	buffer::str('<img src="images/ico_goto.png" alt=""/> ');
	buffer::str('<a href="http://www.dotclear.net/forum/viewtopic.php?id=12923" >Version 0.6.2</a>');

}

function checkNewVersion($http, $current)
{
	$http = explode('.',$http);
	$current = explode('.',$current);

	foreach ($http as $v)
	{
		$httpv .= $v;
	}

	foreach ($current as $v)
	{
		$currentv .= $v;
	}
	
	if ( $httpv < $currentv )
	{
		return true;
	}
	return false;
}

function installImages($theme,$icon,$pre,$ext)
{
	// echo "theme: $theme icon: $icon open: ".dirname(__FILE__).'/images/'.$icon.'/'." <br />";
	$file_list = null;
	$i = 0;
	if ($handle = opendir(dirname(__FILE__).'/images/'.$icon.'/'))
	{
		while (false !== ($file = readdir($handle)))
		{
			if ($file != '.' && $file != '..')
			{
				if ( is_file(dirname(__FILE__).'/images/'.$icon.'/'.$file) )
				{
					if ( stristr($file,$ext) != false )
					{
						$file_list[$i] = $file;
						$i++;
					}
				}
			}
		}
	}

	if ( count($file_list) >= 0 )
	{
		@mkdir(dirname(__FILE__).'/../../../themes/'.$theme.'/images/');
		/* no file to install */
		if (  count($file_list) <= 1 ) return false;
		foreach ( $file_list as $img )
		{
			if ( @copy(dirname(__FILE__).'/images/'.$icon.'/'.$img,dirname(__FILE__).'/../../../themes/'.$theme.'/images/'.$pre.$img) == FALSE )
			{
				return FALSE;
			}
		}
	}
	else
	{
		return FALSE;
	}
	return TRUE;
}

function installJs($theme,$pre,$ext)
{
	@mkdir(dirname(__FILE__).'/../../../themes/'.$theme.'/js/');

	$src = fopen(dirname(__FILE__).'/js/vote.js','r');
	$dst = fopen(dirname(__FILE__).'/../../../themes/'.$theme.'/js/vote.js','w+');
	if ( $src == FALSE || $dst == FALSE )
	{
		return FALSE;
	}
	$themepath = dc_app_url;
	if ( $themepath[strlen($themepath)-1] == '/' && strlen($themepath) > 1)
	{
		$themepath = substr($themepath,0,strlen($themepath)-1);
	}
	$themepath = $themepath . '/themes/' .$theme;
	fwrite($dst,"var path_info = '".$themepath."';\n");
	fwrite($dst,"var img_ext = '".$ext."';\n");
	fwrite($dst,"var img_pre = '".$pre."';\n");
	while (!feof($src))
	{
		$line = fgets($src);
		fwrite($dst,$line);
	}
	fclose($src);
	fclose($dst);
	return TRUE;
}
function getThemesInfos($themes_root)
{
	if ( ! $themes_root )
	{
		return null;
	}
	$themes = new plugins($themes_root,'theme');
	if ( ! $themes )
	{
		return null;
	}
	$themes->getPlugins(false);
	$themes_list = $themes->getPluginsList();
	array_walk($themes_list,create_function('&$v','$v=$v["label"];'));
	$themes_list = array_flip($themes_list);
	return $themes_list;
}

function listImgInIcon($icon,$ext)
{
	$file_list = array();
	$i = 0;
	if ($handle = opendir(dirname(__FILE__).'/images/'. $icon .'/' ) )
	{
		while (false !== ($file = readdir($handle)))
		{
			if ($file != '.' && $file != '..')
			{
				if ( is_file(dirname(__FILE__).'/images/'. $icon .'/'. $file) == TRUE )
				{
					if ( stristr($file,$ext) != false )
					{
						$file_list[$i] = $file;
						$i++;
					}
				}
			}
		}
	}
	return $file_list;
}


buffer::str('<h2>'.__('Ticket Rating').'</h2>');

if ( ! is_dir(dirname($dc_ticketrating_ini_file)) )
{
	if ( ! @mkdir(dirname($dc_ticketrating_ini_file)) )
	{
		buffer::str('<h3>'.__('Failed to create directory').'</h3>');
	}
	else
	{
		@touch($dc_ticketrating_ini_file);
	}
}

$mySubMenu->addItem(__('Home'), 'tools.php?p=ticketrating', 'images/ico_goto.png', FALSE);
$mySubMenu->addItem(__('Installation'), 'tools.php?p=ticketrating&amp;a=setup', 'images/ico_goto.png', FALSE);
$mySubMenu->addItem(__('Help &amp; support'), 'tools.php?p=ticketrating&amp;a=help', 'images/ico_help.png', FALSE);
$mySubMenu->addItem(__('ChangeLog'), 'tools.php?p=ticketrating&amp;a=changelog', 'images/ico_help.png', FALSE);

if(! isset($_GET['a']))
{
	/* INSTALLATION */
	/* Vérification de la présence de la table */
	if(!$rs = $con->select('SHOW TABLES LIKE \''.DB_PREFIX.'rate\''))
	{
		buffer::str('<h3>' . __('SQL Error: ') . $con->error() . '</h3>');
	}
	elseif ($rs->isEmpty())
	{
		// La table n'existe pas, on la créé
		$sql = 'CREATE TABLE IF NOT EXISTS `'.DB_PREFIX.'rate` ('.
			'`rate_post_id` int(11) NOT NULL,'.
			'`rate_ip` varchar(15) NOT NULL,'.
			'`rate_value` tinyint(1) NOT NULL,'.
			'PRIMARY KEY  (`rate_post_id`,`rate_ip`)'.
			')';
		if($con->execute($sql))
		{
			buffer::str('<h4>' . __('<em>Ticket Rating</em> has been successfully installed!') . '</h4>');
		}
		else
		{
			buffer::str('<h3>' . $con->error() . '</h3>');
		}
	}

	$sql = "DESCRIBE ".DB_PREFIX."rate";
	$rs = $con->select($sql);
	if ( ! $rs )
	{
		buffer::str('<h3>' . __('SQL Error: ') . $con->error() . '</h3>');
		buffer::str('<h3>'.$sql.'</h3>');
	}
	else
	{
		if ( $rs->isEmpty())
		{
			buffer::str('<h3>'.__('Cannot get table description').'</h3>');
		}
		else
		{
			$update1 = 0;
			while($rs->fetch())
			{
				switch($rs->f('field'))
				{
					case 'rate_post_id':
						if ( $rs->f('key') != 'PRI' ) $update1++;
					break;
					case 'rate_ip':
						if ( $rs->f('key') != 'PRI' ) $update1++;
					break;
					}
			}
			if ( $update1 == 2 )
			{
				$sql = "ALTER TABLE `dc_rate` ADD PRIMARY KEY ( `rate_post_id` , `rate_ip` )";
				if ( $con->execute($sql) )
				{
					buffer::str('<h4>'.__('Updates').'</h4>');
					buffer::str('<h5><img src="images/check_on.png" alt=""/> '.__('SQL update 1 successfully applied').'</h5>');
				}
				else
				{
					buffer::str('<h4>'.__('Updates').'</h4>');
					buffer::str('<h5><img src="images/check_off.png" alt=""/> '.__('Failed to apply SQL update 1').'</h5>');
				}
			}
			/*
			else
			{
				buffer::str('<h4>'.__('Updates').'</h4>');
				buffer::str('<h5><img src="images/check_on.png" alt=""/> '.__('SQL Update 1 already applied').'</h5>');
			}
			*/
		}
	}
}


if(isset($_GET['a']))
{
	switch ($_GET['a'])
	{
		case 'changelog':
			displayChangeLog();
		break;
		case 'help':
			displayHelp();
		break;

		case 'setup':
			displayUpdate();

			if ( isset($_POST['p_theme']) )
			{

				if ( count(listImgInIcon($_POST['p_icons'],$_POST['p_ext'])) > 0 )
				{
			
					if ( installImages($_POST['p_theme'],$_POST['p_icons'],$_POST['p_pre'],$_POST['p_ext']) == TRUE )
					{
						buffer::str( '<img alt="" src="images/check_on.png" />&nbsp;'. __('Images installed') . '<br />');
						if ( installJs($_POST['p_theme'],$_POST['p_pre'],$_POST['p_ext']) == TRUE )
						{
							buffer::str( '<img alt="" src="images/check_on.png" />&nbsp;'. __('Javascript installed').'<br />');
							buffer::str( '<img alt="" src="images/check_on.png" />&nbsp;'. __('Installation finished'));
						}
						else
						{
							buffer::str( '<img alt="" src="images/check_off.png" />&nbsp;'. __('Installation failed'));
						}
					}
					else
					{
						buffer::str( '<img alt="" src="images/check_off.png" />&nbsp;'. __('Installation failed'));
					}
				}
				else
				{
					buffer::str('<img alt="" src="images/check_off.png" />&nbsp;'. __('Image format not supported'));
				}
			}
			displayThemesList();
		break;
	}
}
else
{

	if ( isset($_POST['save']) )
	{	
		$selected_cat = '';
		foreach($_POST as $k => $v)
		{
			if ( strstr($k,'cat_') != false )
			{
				$selected_cat .= $v.':';
			}
		}
		$ini = new tr_iniFile($dc_ticketrating_ini_file);
		if ( $ini->file == false )
		{
			$ini->file = $dc_ticketrating_ini_file;
		}

		$ini->editVar('selected_cat',$selected_cat);
		if ( $ini->saveFile() )
		{
			buffer::str('<img alt="" src="images/check_on.png" />&nbsp;'.__('Save done').'<br />');
			if ( dc_http_cache == 1 ) files::touch(DC_UPDATE_FILE);
		}
		else
		{
			buffer::str('<img alt="" src="images/check_off.png" />&nbsp;'.__('Failed to save ini file').'<br />');
		}
	}

	displayCategories();

	$rs = $con->select('SELECT count(rate_value) as cpt FROM '.DB_PREFIX.'rate LIMIT 0,1');
	if ( ! $rs )
	{
		buffer::str('<h3>'.__('SQL Error').'</h3>');
	}
	else
	{
		if($rs->f('cpt')!=0)
		{
			buffer::str('<h4>' . __('Informations') . '</h4>');
			buffer::str('<table  class="clean-table"><tr><td>'.__('Total submit').'</td><td>'.$rs->f('cpt').'</td></tr>');
			$rs = $con->select('SELECT round(avg(rate_value),2) as avg FROM '.DB_PREFIX.'rate LIMIT 0,1');
			buffer::str('<tr style="background:#eee;"><td>'.__('Global average').'</td><td>'.$rs->f('avg').'</td></tr>');
			buffer::str('</table>');
		}else{
			buffer::str(__('No ticket has been rated for now'));
		}
	}

	buffer::str('<br />');

	$ops = array(__('Most rated') => 'count(rate_value)', __('Best rated') => 'round(avg(rate_value),2)' );
	foreach($ops as $table_title => $op )
	{
		$query = 'SELECT '.$op.' as value, post_titre FROM '.DB_PREFIX.'rate,'.DB_PREFIX.'post ';
		$query.= 'WHERE post_id = rate_post_id GROUP BY rate_post_id ORDER BY value DESC LIMIT 0,10';
		$rs = $con->select($query);
		if($rs->isEmpty())
		{
			buffer::str(__('No ticket has been rated for now'));
		}
		else
		{
			buffer::str('<table  class="clean-table"><caption><h4>');
			buffer::str($table_title);
			buffer::str('</h4></caption>');
			buffer::str('<tr><td><strong>'.__('Rank').'</strong></td><td><strong>'.__('Ticket').'</strong></td><td><strong>'.__('Count').'</strong></td></tr>');
			$i = 1;
			while ($rs->fetch())
			{
				$style = ($i%2 == 0) ? ' style="background:#eee;"' : '';
				buffer::str('<tr '.$style.'><td>'.$i++.'</td><td>'.$rs->f('post_titre').'</td><td>'.$rs->f('value').'</td></tr>');
			}
			buffer::str('</table><br />');
		}
	}

}
?>
