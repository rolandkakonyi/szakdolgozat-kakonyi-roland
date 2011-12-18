<?php

/**
 * Profession
 * @package Profession
 */

/**
 * PEAR - PDO �tj�r� �s PDO wrapper oszt�ly
 * 
 * Az oszt�ly t�bbnyire private �s protected met�dusokat tartalmaz
 * Ezek mindegyike a l�that�s�guk ellen�re megh�vhat� a __call f�ggv�nyen kereszt�l,
 * azonban a private met�dusok csak a m�k�d�shez sz�ks�gesek,
 * �s csak a protected illetve public l�that�s�g� met�dusok megh�v�sa aj�nlott.
 * 
 * A __call csak akkor fut le, ha k�v�lr�l nem l�that� met�dust akar a program megh�vni,
 * �gy a protected met�dusok el�tt lefuttathatunk egy kapcsolatellen�rz�st/l�trehoz�st,
 * de nem kell mindegyik met�dusnak k�l�n megh�vni ezt a f�ggv�nyt.
 * 
 * @package Profession
 * @subpackage DB
 * @todo a __call met�dust esetleg �t�rni �gy, hogy a private f�ggv�nyeket ne h�vja meg
 */
class WraPDO {
    /**
     * a t�bl�khoz kapcsol�d� esetleges szekvenci�k v�gz�d�se
     */
    const SEQ_POSTFIX='_seq';
    /**
     * A h�v�met�dus lefut�s�nak m�dja insert lesz
     * @see WraPDO::autoExecute()
     * @see WraPDO::autoPrepare()
     */
    const DB_AUTOQUERY_INSERT=1;
    /**
     * A h�v�met�dus lefut�s�nak m�dja update lesz
     * @see WraPDO::autoExecute()
     * @see WraPDO::autoPrepare()
     */
    const DB_AUTOQUERY_UPDATE=2;

    /**
     * @var string a kapcsol�d�shoz sz�ks�ges adatforr�s string
     */
    private $_dsn;

    /**
     * @var string adatb�zis t�pusa (pgsql vagy mysql)
     * @see WraPDO::nextId()
     */
    private $_dbtype;

    /**
     * @var string a db kapcsolat felhaszn�l� neve
     */
    private $_username;

    /**
     * @var string a db kapcsolat jelszava
     */
    private $_passwd;

    /**
     * @var array db-driver f�gg� kulcs=>�rt�k t�mb a k�l�nb�z� param�terek megad�s�ra
     */
    private $_options;

    /**
     * @var PDO
     */
    private $_db;

    /**
     * Be�ll�tja a kapcsol�d�shoz sz�ks�ges param�tereket
     * 
     * @param string $dsn
     * @param string $dbtype
     * @param string $username
     * @param string $passwd
     * @param array $options 
     */
    public function __construct($dsn, $dbtype, $username=null, $passwd=null, $options=null) {
        $this->_dsn = $dsn;
        $this->_dbtype = $dbtype;
        $this->_username = $username;
        $this->_passwd = $passwd;
        $this->_options = $options;
    }

    /**
     * Visszaadja, ha nem l�tezett, l�tre is hozza a PDO objektumot
     * 
     * @return PDO
     */
    public function getConnection() {
        if (!$this->_db) {
            $this->_db = new PDO($this->_dsn, $this->_username, $this->_passwd, $this->_options);
        }
        return $this->_db;
    }

    /**
     * Megh�vja az oszt�ly adott - k�v�lr�l nem l�that� - met�dus�t, vagy ha ilyen nincs,
     * akkor a PDO met�dus�t
     * 
     * @uses WraPDO::getConnection()
     * @param string $name a h�vand� met�dus neve
     * @param array $arguments a h�vand� met�dus param�terei
     * @return mixed a h�vott met�dus visszat�r�si �rt�ke
     */
    public function __call($name, $arguments) {
        $this->getConnection();
        if (method_exists($this, $name)) {
            return call_user_func_array(array($this, $name), $arguments);
        } else {
            return call_user_func_array(array($this->_db, $name), $arguments);
        }
    }

    /**
     * Visszaad egyetlen elemet a lek�rdez�sb�l
     *
     * @see WraPDO::__call()
     * @uses WraPDO::_prepExec()
     * @uses WraPDO::isError()
     * @uses PDOStatement::fetchColumn()
     * @param string $query
     * @param array $params 
     * @return string|WraPDOError
     */
    protected function getOne($query, $params=null) {
        $sth = &$this->_prepExec($query, $params);
        if (!WraPDO::isError($sth)) {
            return $sth->fetchColumn(0);
        } else {
            return $sth;
        }
    }

    /**
     * Visszaad egyetlen oszlopot a lek�rdez�sb�l
     *
     * @see WraPDO::__call()
     * @uses WraPDO::getAll()
     * @param string $query
     * @param int $col az oszlop sorsz�ma
     * @param array $params
     * @return array|WraPDOError
     */
    protected function getCol($query, $col=0, $params=null) {
        return $this->getAll($query, $params, PDO::FETCH_COLUMN, $col);
    }

    /**
     * Visszaad egyetlen sort a lek�rdez�sb�l
     *
     * @see WraPDO::__call()
     * @uses WraPDO::_prepExec()
     * @uses WraPDO::isError()
     * @uses PDOStatement::fetch()
     * @param string $query
     * @param array $params
     * @param int $options @link http://www.php.net/manual/en/pdostatement.fetch.php
     * @return mixed|WraPDOError
     */
    protected function getRow($query, $params=null, $options=null) {
        $sth = &$this->_prepExec($query, $params);
        if (!WraPDO::isError($sth)) {
            return $sth->fetch($options);
        } else {
            return $sth;
        }
    }

    /**
     * Visszaadja a lek�rdez�s �sszes elem�t
     *
     * @see WraPDO::__call()
     * @uses WraPDO::_prepExec()
     * @uses WraPDO::isError()
     * @uses PDOStatement::fetchAll()
     * @param string $query
     * @param array $params
     * @param int $options
     * @param int $col csak a kiv�lasztott oszlop elemeit adja vissza
     * @return array|WraPDOError
     */
    protected function getAll($query, $params=null, $options=null, $col=null) {
        $sth = &$this->_prepExec($query, $params);
        if (!WraPDO::isError($sth)) {
            if ($col) {
                return $sth->fetchAll($options, $col);
            } else {
                return $sth->fetchAll($options);
            }
        } else {
            return $sth;
        }
    }

    /**
     * Visszaadja a lek�rdez�s �sszes elem�t asszociat�v t�mbk�nt
     *
     * @see WraPDO::__call()
     * @uses WraPDO::getAll()
     * @param string $query
     * @param array $params
     * @param int $options
     * @return array|WraPDOError
     */
    protected function getAssoc($query, $params=null, $options=null) {
        return $this->getAll($query, $params, PDO::FETCH_KEY_PAIR);
    }

    /**
     * Lefuttat egy lek�rdez�st
     *
     * @see WraPDO::__call()
     * @uses WraPDO::_prepExec()
     * @param string $query
     * @param array $params
     * @return PDOStatement|WraPDOError
     */
    protected function query($query, $params=null) {
        $sth = &$this->_prepExec($query, $params);
        return $sth;
    }

    /**
     * T�bb lek�rdez�st futtat le ugyanazzal a statement-tel, de k�l�nb�z� param�terrel
     * 
     * @see WraPDO::__call()
     * @uses WraPDO::execute()
     * @uses WraPDO::isError()
     * @param PDOStatement $sth
     * @param array $paramArr
     * @return boolean|WraPDOError ha sikeres, akkor true, egy�bk�nt error
     */
    protected function executeMultiple($sth, $paramArr) {
        foreach ($paramArr as $params) {
            $res = $this->execute($sth, $params);
            if (WraPDO::isError($res)) {
                return $res;
            }
        }
        return true;
    }

    /**
     * PDOStatement::execute wrap; ha sz�mot kap param�terben, akkor azt sz�mk�nt kezelje
     * 
     * @see WraPDO::__call()
     * @uses PDOStatement::bindParam()
     * @uses PDOStatement::execute()
     * @param PDOStatement $sth
     * @param mixed $params
     * @return PDOStatement|WraPDOError 
     */
    protected function execute($sth, $params) {
        $par = (is_array($params) || $params == null) ? $params : array($params);

        if (is_array($par)) {
            /**
             * referencia szerint kell �tadni, mert a bindParam-nak referencia kell
             */
            foreach ($par as $key => &$val) {
                /*
                 * ha :param van a query-ben, akkor asszociat�v t�mb,
                 * egy�bk�nt 1-t�l kezd�d�en indexelt
                 */
                $skey = is_numeric($key) ? $key + 1 : $key;

                /**
                 * ha a param�ter �rt�ke sz�m, akkor pdo t�pus cast-ol�s sz�ks�ges
                 * @link http://bugs.php.net/bug.php?id=44639
                 */
                if (is_numeric($val)) {
                    $sth->bindParam($skey, $val, PDO::PARAM_INT);
                } else {
                    $sth->bindParam($skey, $val);
                }
            }
        }
        if ($sth->execute()) {
            return $sth;
        } else {
            return new WraPDOError($sth, $params);
        }
    }

    /**
     * Prepar�l �s v�grehajt egy query-t
     * 
     * @uses PDO::prepare()
     * @uses WraPDO::execute()
     * @param string $query
     * @param array $params
     * @return PDOStatement|WraPDOError
     */
    private function _prepExec($query, $params=null) {
        $sth = $this->_db->prepare($query);
        return $this->execute($sth, $params);
    }

    /**
     * Ha a param�ter PDOStatement, akkor nincs hiba, vagyis isError false
     * Ha hiba van, akkor true-t ad vissza
     * 
     * @param PDOStatement|WraPDOError
     * @return boolean
     */
    public static function isError($res) {
        if (is_a($res, 'WraPDOError')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Kik�ri a sequence k�vetkez� elem�t
     * 
     * @see WraPDO::__call()
     * @uses WraPDO::getSequenceName()
     * @uses WraPDO::getOne()
     * @uses WraPDO::query()
     * @uses WraPDO::isError()
     * @uses PDO::lastInsertId()
     * @param string $seq_name
     * @return string|WraPDOError 
     */
    protected function nextId($seq_name) {
        $seqname = $this->getSequenceName($seq_name);
        switch ($this->_dbtype) {
            case 'mysql':
                $res = $this->query('UPDATE ' . $seqname . ' SET id=LAST_INSERT_ID(id+1)');
                if (!WraPDO::isError($res)) {
                    return $this->_db->lastInsertId();
                } else {
                    return $res;
                }
        }
    }

    /**
     * A megadott t�bl�n a megadott asszociat�v t�mbb�l lek�rdez�st csin�l, �s lefuttatja
     * $mode-t�l f�gg�en insert vagy update lehet
     * 
     * @see WraPDO::__call()
     * @uses WraPDO::autoPrepare()
     * @uses WraPDO::isError()
     * @uses WraPDO::execute()
     * @param string $table
     * @param array $fields_values
     * @param int $mode
     * @param string $where
     * @return PDOStatement|WraPDOError
     */
    protected function autoExecute($table, $fields_values, $mode = WraPDO::DB_AUTOQUERY_INSERT, $where = false) {
        $sth = $this->autoPrepare($table, array_keys($fields_values), $mode, $where);
        if (WraPDO::isError($sth)) {
            return $sth;
        }
        $ret = $this->execute($sth, array_values($fields_values));
        return $ret;
    }

    /**
     * A megadott t�bl�n a megadott asszociat�v t�mbb�l lek�rdez�st prepare-el,
     * $mode-t�l f�gg�en insert vagy update lehet
     *
     * @see WraPDO::__call()
     * @uses WraPDO::_buildManipSQL()
     * @uses WraPDO::isError()
     * @uses PDO::prepare()
     * @param string $table
     * @param array $table_fields
     * @param int $mode
     * @param string $where
     * @return PDOStatement|WraPDOError
     */
    protected function autoPrepare($table, $table_fields, $mode = WraPDO::DB_AUTOQUERY_INSERT, $where = false) {
        $query = $this->_buildManipSQL($table, $table_fields, $mode, $where);
        if (WraPDO::isError($query)) {
            return $query;
        }
        return $this->_db->prepare($query);
    }

    /**
     * A megadott t�bl�n a megadott asszociat�v t�mbb�l lek�rdez�st csin�l,
     * $mode-t�l f�gg�en insert vagy update lehet
     *
     * @param string $table
     * @param array $table_fields
     * @param int $mode
     * @param string $where
     * @return PDOStatement|WraPDOError
     */
    private function _buildManipSQL($table, $table_fields, $mode, $where = false) {
        $first = true;
        switch ($mode) {
            case WraPDO::DB_AUTOQUERY_INSERT:
                $values = '';
                $names = '';
                foreach ($table_fields as $value) {
                    if ($first) {
                        $first = false;
                    } else {
                        $names .= ',';
                        $values .= ',';
                    }
                    $names .= $value;
                    $values .= '?';
                }
                return "INSERT INTO $table ($names) VALUES ($values)";
            case WraPDO::DB_AUTOQUERY_UPDATE:
                $set = '';
                foreach ($table_fields as $value) {
                    if ($first) {
                        $first = false;
                    } else {
                        $set .= ',';
                    }
                    $set .= "$value = ?";
                }
                $sql = "UPDATE $table SET $set";
                if ($where) {
                    $sql .= " WHERE $where";
                }
                return $sql;
        }
    }

}

?>