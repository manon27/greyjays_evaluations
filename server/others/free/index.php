<?php

$app_path = '/';
$app_file_path = __FILE__;
$app_gj_path = dirname(__FILE__).$app_path;

require $app_gj_path.'/layout/prepend.php';

header('Content-Type: application/json; charset='.gj_encoding);

include $gj_template_file;

require $app_gj_path.'/layout/append.php';

?>