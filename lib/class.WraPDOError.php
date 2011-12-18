<?php

/**
 * WraPDO hiba eset�n ezt az oszt�lyt adja vissza
 * 
 * @package Profession
 * @subpackage DB
 */
class WraPDOError {

    /**
     * @var int ANSI SQL hibak�d
     */
    private $sqlstate;

    /**
     * @var int szerverspecifikus hibak�d
     */
    private $errorCode;

    /**
     * @var string hiba�zenet
     */
    private $errorMessage;

    /**
     *
     * @var string a lek�rdez�s
     */
    private $query;

    /**
     *
     * @var array a lek�rdez�s param�terei
     */
    private $params;

    /**
     * Be�ll�tja az oszt�lyv�ltoz�kat
     * 
     * @uses PDOStatement::errorInfo()
     * @param PDOStatement $statement
     * @param array $params 
     */
    public function __construct($statement, $params) {
        global $GLOBALS;
        $eI = $statement->errorInfo();
        $this->sqlstate = $eI[0];
        $this->errorCode = $eI[1];
        $this->errorMessage = $eI[2];
        $this->query = $statement->queryString;
        $this->params = $params;
        if ($GLOBALS['log']['dberror']) {
            $log = $this->errorCode . ' - ' . $this->errorMessage . " " . $this->query;
            error_log($log, 0);
        }
    }

    /**
     * Visszaadja a hib�zenet sz�veges r�sz�t
     * 
     * @return string
     */
    public function getMessage() {
        return $this->errorMessage;
    }

}

?>