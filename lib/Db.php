<?php

class Db {

	protected static $_oDb;

	public static function getInstance() {
		if (!self::$_oDb instanceof PDO) {
			global $CONF;
			try {
				self::$_oDb = new PDO("sqlite:" . $CONF['db_settings']['path'] . $CONF['db_settings']['filename']);
				self::$_oDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			}
			catch (PDOException $e) {
				die(json_encode(array('success' => false, 'error' => 'Adatbázis csatlakozási hiba!', 'debugMessage' => $e->getMessage())));
			}
		}
		return self::$_oDb;
	}

}

?>
