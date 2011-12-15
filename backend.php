<?php

require_once 'conf/config.php';

//print_r($_SERVER);

$destination=$CONF['root_path'].$_FILES['uploadData']['name'];
move_uploaded_file($_FILES['uploadData']['tmp_name'], $destination);
$file=file_get_contents($destination);
$data=array_merge($_REQUEST,$_FILES,array('file'=> iconv("ISO-8859-2","UTF-8",$file),'dest'=>$destination));
die(json_encode($data));
?>
