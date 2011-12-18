<?php

function pr($arr, $die=true) {
    echo '<pre>';
    print_r($arr);
    echo '</pre>';
    if ($die) {
        die();
    }
}

$CONF = array();
$dir = explode('/', $_SERVER['SCRIPT_FILENAME']);
$root = implode('/', array_slice($dir, 0, count($dir) - 1));
$CONF['root_path'] = $root . '/';

$CONF['lib_path'] = $CONF['root_path'] . 'lib/';

function __autoload($class_name) {
    global $CONF;
    $cn = strtolower($class_name);
    $fn = $CONF['lib_path'] . $cn . '.php';
    if (file_exists($fn)) {
        require_once $fn;
    } else {
        $fn = $CONF['lib_path'] . $class_name . '.php';
        if (file_exists($fn))
            require_once $fn;
    }
}

$CONF['site_url'] = 'http://' . $_SERVER['SERVER_NAME'] . "/";
$CONF['ajax_url'] = $CONF['site_url'] . "backend.php";

/*
 * sqlite autoincrement más mint a mysql, ha egy integer primary key-t állítunk be akkor az autoincrement lesz.
 * http://www.sqlite.org/faq.html#q1
 * 
 * http://mydumbthoughts.wordpress.com/2010/06/12/sqlite-primary-key-column-not-auto-incrementing/
 * 
 */

$CONF['db_settings'] = array(
    'path' => $CONF['root_path'] . "db/",
    'filename' => 'db.sqlite'
);
?>
