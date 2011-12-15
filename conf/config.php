<?php

$CONF = array();
$dir = explode('/', $_SERVER['SCRIPT_FILENAME']);
$root = implode('/', array_slice($dir, 0, count($dir) - 2));
$CONF['root_path'] = $root . '/';

$CONF['class_path'] = $CONF['root_path'] . 'class/';

function __autoload($class_name) {
    global $CONF;
    $cn = strtolower($class_name);
    $fn = $CONF['class_path'] . $cn . '.php';
    if (file_exists($fn)) {
        require_once $fn;
    } else {
        $fn = $CONF['class_path'] . $CONF['class_package'][$cn] . $class_name . '.php';
        if (file_exists($fn))
            require_once $fn;
    }
}

$CONF['site_url'] = 'http://' . $_SERVER['SERVER_NAME'] . "/";
$CONF['ajax_url'] = $CONF['site_url'] . "backend.php";

$CONF['db_settings'] = array(
    'type' => 'sqlite',
    'path' => $CONF['root_path'] . "db/",
    'filename' => 'db.data'
);

$DB = new flatFile($CONF['flatFile_path'], "db.dat");

?>
