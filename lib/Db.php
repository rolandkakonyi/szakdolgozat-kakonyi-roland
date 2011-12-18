<?php

class Db {

    protected static $_db;

    public static function getInstance() {
        if (!self::$_db instanceof PDO) {
            global $CONF;
            try {
                self::$_db = new PDO("sqlite:" . $CONF['db_settings']['path'] . $CONF['db_settings']['filename']);
            } catch (PDOException $e) {
                die(json_encode(array('success' => false, 'error' => 'Adatbázis csatlakozási hiba!', 'debugMessage' => $e->getMessage())));
            }
        }
        return self::$_db;
    }

}

?>
