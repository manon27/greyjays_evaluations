<?php

require dirname(__FILE__).'/conf.php';

session_start();

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
if (isset($_SERVER['PATH_INFO'])) {
	$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
	$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
	$key = array_shift($request)+0;
}
$input = json_decode(file_get_contents('php://input'),true);

// connect to the mysql database
$link = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_DBASE);
mysqli_set_charset($link,'utf8');

// retrieve the table and key from the path

if ($input != null) {
	// escape the columns and values from the input object
	$columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
	$values = array_map(function ($value) use ($link) {
		if ($value===null) return null;
		return mysqli_real_escape_string($link,(string)$value);
	},array_values($input));

	// build the SET part of the SQL command
	$set = '';
	for ($i=0;$i<count($columns);$i++) {
		$set.=($i>0?',':'').'`'.$columns[$i].'`=';
		$set.=($values[$i]===null?'NULL':'"'.$values[$i].'"');
	}
}

//	si method=POST
if ($method == 'POST') {
	//debut authentification
	if ($table == 'login') {
		if (($columns[1]=='password') && ($values[1] == GJ_PASS)) {
			$_SESSION["gj_app"] = GJ_SESSION;
			http_response_code(200);
			echo('{"login":"ok"}');
			exit();
		}
	}
	//fin authentification
	elseif ($table == 'logout') {
		unset($_SESSION["gj_app"]);
		http_response_code(200);
		echo('{"logout":"ok"}');
		exit();
	}
}

//	si methode<>GET -> Test de l'authentification
if (($method != 'GET') && ($_SERVER['HTTP_HOST']!='localhost')) {
	if ($_SESSION["gj_app"] != GJ_SESSION) {
		http_response_code(403);
		exit();
	}
}
// create SQL based on HTTP method
switch ($method) {
	case 'GET':
		$sql = "select * from `$table`".($key?" WHERE `id`=$key":'');
		break;
	case 'PUT':
		$sql = "update `$table` set $set where `id`=$key";
		break;
	case 'POST':
		$sql = "insert into `$table` set $set";
		break;
	case 'DELETE':
		$sql = "delete from `$table` where `id`=$key";
		break;
}

// excecute SQL statement
$result = mysqli_query($link,$sql);

// die if SQL statement failed
if (!$result) {
	http_response_code(404);
	die(mysqli_error($link));
}

// print results, insert id or affected row count
if ($method == 'GET') {
	if (!$key) echo '[';
	for ($i=0;$i<mysqli_num_rows($result);$i++) {
		echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
	}
	if (!$key) echo ']';
} elseif ($method == 'POST') {
	echo mysqli_insert_id($link);
} else {
	echo mysqli_affected_rows($link);
}

// close mysql connection
mysqli_close($link);