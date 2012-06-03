<?php

class dataset {

	protected $iId;
	protected $sName;

	public function __construct($iId = NULL, $sName = NULL) {
		if ($iId) {
			$this->iId = intval($iId);
		}
		elseif ($sName) {
			$this->sName = $sName;
		}
	}

	public function getId() {
		return $this->iId;
	}

	public function import($sSource_file) {
		try {
			$oSth = Db::getInstance()->prepare("INSERT INTO datasets (name,creation_date) VALUES (:name,:creation_date)");
			$oSth->bindParam(':name', $this->sName);
			$oSth->execute();
			$this->iId = Db::getInstance()->lastInsertId();
		}
		catch (PDOException $e) {
			die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $e->getMessage())));
		}
		return $this->_savePoints($sSource_file);
	}

	public function process() {
		try {
			$this->filterAndMove();
			$iMax = 500;
			//sleep(15);
			return array('success' => true, 'msg' => 'A feldolgozás sikeres!'/* , 'data' => array('max' => $iMax, 'data' => $aRawDataset) */);
		}
		catch (PDOException $oE) {
			die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
		}
	}

	//http://tools.ietf.org/html/rfc4180
	public static function isValidCsvMimeType($aFile) {
		$aValidTypes = array(
			'text/comma-separated-values',
			'text/csv',
			'application/csv',
			'application/excel',
			'application/vnd.ms-excel',
			'application/vnd.msexcel',
			'text/anytext');
		return in_array($aFile['type'], $aValidTypes);
	}

	public static function getDatasetList($iPage = 1) {
		try {
			$oSth = Db::getInstance()->query('SELECT count(*) FROM datasets ORDER BY creation_date DESC');
			$oSth->execute();
			$iCount = intval($oSth->fetchColumn(0));
			if ($iCount) {
				$iOffset = intval(($iPage - 1) * 10);
				$oSth = Db::getInstance()->query("SELECT d.id as id,d.name as name,strftime('%Y. %m. %d. %H:%M:%S',d.creation_date) as creation_date,count(p.id) as count FROM datasets d JOIN points p ON d.id=p.dataset_id GROUP BY d.id ORDER BY creation_date DESC LIMIT 10 OFFSET " . $iOffset);
				$oSth->execute();
				$aDatasets = $oSth->fetchAll(PDO::FETCH_ASSOC);
			}
			else {
				$aDatasets = array();
				$iOffset = 0;
			}
		}
		catch (PDOException $oE) {
			die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
		}
		return array('success' => true, 'datasets' => $aDatasets, 'count' => $iCount, 'offset' => $iOffset);
	}

	public function load() {
		try {
			$oSth = Db::getInstance()->query('SELECT d.id,d.name,d.creation_date,p.lat,p.lng,p.count FROM datasets d JOIN points p ON p.dataset_id=d.id WHERE d.id=:id ORDER BY p.id');
			$oSth->bindParam(':id', $this->iId);
			$oSth->execute();
			$aDataset = $oSth->fetchAll(PDO::FETCH_ASSOC);
			if (!count($aDataset)) {
				die(json_encode(array('success' => false, 'error' => 'Nem találhatóak az adatsorhoz tartozó pontok!')));
			}
			else {
				$aPoints = array();
				foreach ($aDataset as $aRow) {
					$aPoints[] = array(
						'lat' => floatval($aRow['lat']),
						'lng' => floatval($aRow['lng']),
						'count' => floatval($aRow['count'])
					);
				}
				$aDataset = $aDataset[0];
				unset($aDataset['lng'], $aDataset['lat'], $aDataset['count']);
			}
		}
		catch (PDOException $oE) {
			die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
		}
		return array('success' => true, 'dataset' => $aDataset, 'points' => $aPoints);
	}

	protected function _savePoints($sSource_file, $sDelimiter = ",", $iMax_line_length = 70, $sEnclosure = '"') {
		if (($handle = fopen($sSource_file, "r")) !== FALSE) {
			try {
				$sQuery = "
                INSERT INTO points_draft (lat,lng,count,dataset_id) 
                    VALUES (:lat,:lng,:count,:dataset_id);";
				$oSth = db::getInstance()->prepare($sQuery);
				$oSth->bindParam(':dataset_id', $this->iId);
				$oSth->bindParam(':lat', $fLat);
				$oSth->bindParam(':lng', $fLng);
				$oSth->bindParam(':count', $fCount);
			}
			catch (PDOException $oE) {
				die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
			}
			$iRowNum = 0;
			$iImportedRowNum = 0;
			while (($aRow = fgetcsv($handle, $iMax_line_length, $sDelimiter, $sEnclosure)) !== FALSE) {
				try {
					++$iRowNum;
					$fLat = floatval($aRow[0]);
					$fLng = floatval($aRow[1]);
					$fCount = floatval($aRow[2]);
					if (isset($fLat) && isset($fLng) && isset($fCount)) {
						$oSth->execute();
						++$iImportedRowNum;
					}
				}
				catch (PDOException $oE) {
					@fclose($handle);
					die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
				}
			}
			fclose($handle);
			return array('rowNum' => $iRowNum, 'importedRowNum' => $iImportedRowNum);
		}
		die(json_encode(array('success' => false, 'error' => 'A feltöltött fájl nem nyitható meg!')));
	}

	protected function filterAndMove() {
		$oSth = Db::getInstance()->query('SELECT lat,lng,count FROM points_draft WHERE dataset_id=:dataset_id ORDER BY lat ASC');
		$oSth->bindParam(':dataset_id', $this->iId);
		$oSth->execute();
		$aRawDataset = $oSth->fetchAll(PDO::FETCH_ASSOC);
		$fSum = 0;
		$iDb = count($aRawDataset);
		//átlag számolás
		foreach ($aRawDataset as &$aRow) {
			$aRow['count'] = floatval($aRow['count']);
			$fSum+=$aRow['count'];
		}
		$fAvg = $fSum / $iDb;
		//szórás számolás
		$fDff2_sum = 0;
		foreach ($aRawDataset as &$aRow) {
			$fDff2_sum+= ($aRow['count'] - $fAvg) * ($aRow['count'] - $fAvg);
		}
		$fDispersion = sqrt($fDff2_sum / ($iDb - 1));

		//azok kiválogatása amelyek az átlag-szórás és az átlag+szórás intervallumban helyezkednek el,
		//ezeket egyből át is helyezzük points táblába

		$oSth = Db::getInstance()->query('INSERT INTO points (lat,lng,count,dataset_id) SELECT lat,lng,count,dataset_id FROM points_draft WHERE dataset_id=:dataset_id AND count>=(:avg-:diff_avg) AND count<=(:avg+:diff_avg) ORDER BY lat ASC');
		$oSth->bindParam(':avg', $fAvg);
		$oSth->bindParam(':diff_avg', $fDispersion);
		$oSth->bindParam(':dataset_id', $this->iId);
		$oSth->execute();

		//újra lekérni gyorsabb mint php-ben összehasonlítani
		$oSth = Db::getInstance()->query('SELECT lat,lng,count FROM points WHERE dataset_id=:dataset_id ORDER BY lat ASC');
		$oSth->bindParam(':dataset_id', $this->iId);
		$oSth->execute();
		$aRawDataset = $oSth->fetchAll(PDO::FETCH_ASSOC);
		echo '<pre>';
		print_r($aRawDataset);
		echo '</pre>';
		die();
		//echo $db-count($rawDataset).' kiszűrve.';
	}

}

?> 