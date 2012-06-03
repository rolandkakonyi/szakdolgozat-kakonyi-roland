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
			$oSth->bindParam(':creation_date', date('Y-m-d H:i:s'));
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
			$param = floatval($_POST['param']);
			$newParam = floatval($_POST['newParam']);

			if ($param != $newParam) {

				$sSql = "
					SELECT p.id, p.lat, p.lng, p.value 
					FROM datasets d JOIN points p 
						ON p.dataset_id=d.id 
					WHERE d.id=:dataset_id
					ORDER BY p.lat ASC,p.lng ASC
				";

				$oSth = Db::getInstance()->prepare($sSql);
				$oSth->bindParam(':dataset_id', $this->iId);
				$oSth->execute();
				$aPoints = $oSth->fetchAll(PDO::FETCH_ASSOC);

				if (count($aPoints) < 3) {
					die(json_encode(array('success' => false, 'error' => 'Nincs elegendő pont a forrás meghatározásához!')));
				}

				$aEqualPoints = array();
				for ($i = 0; $i < count($aPoints); $i++) {
					for ($j = $i; $j < count($aPoints); $j++) {
						if ($i == $j) {
							$aEqualPoints[$aPoints[$i]['id']][] = $aPoints[$j];
							continue;
						}
						$diff = abs(floatval($aPoints[$j]['value']) - floatval($aPoints[$i]['value']));
						if ($diff <= $newParam) {
							$aEqualPoints[$aPoints[$i]['id']][] = $aPoints[$j];
							$aEqualPoints[$aPoints[$j]['id']][] = $aPoints[$i];
						}
					}
				}

				$maxArrCount = 0;
				foreach ($aEqualPoints as $i => $arr) {
					$count = count($arr);
					if ($count > $maxArrCount) {
						$maxArrCount = $count;
						$maxArrIdx = $i;
					}
				}
				if ($maxArrCount < 3) {
					die(json_encode(array('success' => false, 'error' => 'Nincs elegendő ekvivalens pont a paraméter alapján a forrás meghatározásához!<br/>Kérem válasszon másik paraméter értéket!')));
				}
				$aPoints = array();
				$aPoints[0] = $aEqualPoints[$maxArrIdx][0];
				$aPoints[1] = $aEqualPoints[$maxArrIdx][round($maxArrCount / 2) - 1];
				$aPoints[2] = $aEqualPoints[$maxArrIdx][$maxArrCount - 1];
				unset($aEqualPoints);

				$bx = floatval($aPoints[0]['lat']);
				$by = floatval($aPoints[0]['lng']);

				$cx = floatval($aPoints[1]['lat']);
				$cy = floatval($aPoints[1]['lng']);

				$dx = floatval($aPoints[2]['lat']);
				$dy = floatval($aPoints[2]['lng']);

				$tmp = $cx * $cx + $cy * $cy;
				$bc = ($bx * $bx + $by * $by - $tmp) / 2;
				$cd = ($tmp - $dx * $dx - $dy * $dy) / 2;

				$det = ($bx - $cx) * ($cy - $dy) - ($cx - $dx) * ($by - $cy);
				$det = 1 / $det;

				$lat = ($bc * ($cy - $dy) - $cd * ($by - $cy)) * $det;
				$lng = (($bx - $cx) * $cd - ($cx - $dx) * $bc) * $det;

				$sSql = "SELECT lat,lng FROM points WHERE dataset_id=:dataset_id ORDER BY (lat-:lat)*(lat-:lat)+(lng-:lng)*(lng-:lng) DESC LIMIT 1";
				$oSth = Db::getInstance()->prepare($sSql);
				$oSth->bindParam(':lat', $lat);
				$oSth->bindParam(':lng', $lng);
				$oSth->bindParam(':dataset_id', $this->iId);
				$oSth->execute();
				$aFar = $oSth->fetchAll(PDO::FETCH_ASSOC);

				$radius = self::distHaversine(array('lat' => floatval($lat), 'lng' => floatval($lng)), array('lat' => floatval($aFar[0]['lat']), 'lng' => floatval($aFar[0]['lng'])));
				$radius*=1000;

				$sSql = "DELETE FROM weight_points WHERE dataset_id=:dataset_id";
				$oSth = Db::getInstance()->prepare($sSql);
				$oSth->bindParam(':dataset_id', $this->iId);
				$oSth->execute();
				$sSql = "INSERT INTO weight_points (lat,lng,diff,radius,dataset_id) VALUES (:lat,:lng,:diff,:radius,:dataset_id)";
				$oSth = Db::getInstance()->prepare($sSql);
				$oSth->bindParam(':lat', $lat);
				$oSth->bindParam(':lng', $lng);
				$oSth->bindParam(':diff', $newParam);
				$oSth->bindParam(':radius', $radius);
				$oSth->bindParam(':dataset_id', $this->iId);
				$oSth->execute();
			}
			else {
				$sSql = "
					SELECT * 
					FROM weight_points p
					WHERE dataset_id=:dataset_id AND diff=:diff
					ORDER BY p.lat ASC,p.lng ASC
				";

				$oSth = Db::getInstance()->prepare($sSql);
				$oSth->bindParam(':dataset_id', $this->iId);
				$oSth->bindParam(':diff', $param);
				$oSth->execute();
				$center = $oSth->fetchAll(PDO::FETCH_ASSOC);
				$lat = floatval($center[0]['lat']);
				$lng = floatval($center[0]['lng']);
				$radius = floatval($center[0]['radius']);
			}

			return array('success' => true, 'msg' => 'A feldolgozás sikeres!', 'center' => array('lat' => floatval($lat), 'lng' => floatval($lng)), 'radius' => floatval($radius));
		}
		catch (PDOException $oE) {
			die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
		}
	}

	public static function distHaversine($p1, $p2) {
		$R = 6371; // earth's mean radius in km
		$dLat = deg2rad($p2['lat'] - $p1['lat']);
		$dLong = deg2rad($p2['lng'] - $p1['lng']);

		$a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($p1['lat'])) * cos(deg2rad($p2['lat'])) * sin($dLong / 2) * sin($dLong / 2);
		$c = 2 * atan2(sqrt($a), sqrt(1 - $a));
		$d = $R * $c;

		return round($d, 3);
	}

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
				$iOffset = intval(($iPage - 1) * 5);
				$oSth = Db::getInstance()->query("SELECT d.id as id,d.name as name,strftime('%Y. %m. %d. %H:%M:%S',d.creation_date) as creation_date,count(p.id) as count FROM datasets d LEFT JOIN points p ON d.id=p.dataset_id GROUP BY d.id ORDER BY creation_date DESC LIMIT 5 OFFSET " . $iOffset);
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
			$oSth = Db::getInstance()->prepare("SELECT d.id,d.name,strftime('%Y. %m. %d. %H:%M:%S',d.creation_date) as creation_date, w.diff as param, w.lat, w.lng FROM datasets d LEFT JOIN weight_points w ON d.id=w.dataset_id WHERE d.id=:id");
			$oSth->bindParam(':id', $this->iId);
			$oSth->execute();
			$aDataset = $oSth->fetchAll(PDO::FETCH_ASSOC);
			$aDataset = $aDataset[0];
			$oSth = Db::getInstance()->prepare('SELECT p.lat,p.lng,p.value FROM datasets d JOIN points p ON p.dataset_id=d.id WHERE d.id=:id ORDER BY p.id');
			$oSth->bindParam(':id', $this->iId);
			$oSth->execute();
			$aPoints = $oSth->fetchAll(PDO::FETCH_ASSOC);
			if (!count($aPoints)) {
				die(json_encode(array('success' => false, 'error' => 'Nem találhatóak az adatsorhoz tartozó pontok!')));
			}
			else {
				$iMax = 0;
				foreach ($aPoints as $aRow) {
					$iValue = floatval($aRow['value']);
					if ($iValue > $iMax) {
						$iMax = $iValue;
					}
					$aPoints[] = array(
						'lat' => floatval($aRow['lat']),
						'lng' => floatval($aRow['lng']),
						'count' => $iValue
					);
				}
				$oSth = Db::getInstance()->prepare("SELECT p.lat,p.lng FROM datasets d JOIN points p ON p.dataset_id=d.id WHERE d.id=:id ORDER BY p.lat+p.lng ASC LIMIT 1");
				$oSth->bindParam(':id', $this->iId);
				$oSth->execute();
				$aBoundSw = $oSth->fetchAll(PDO::FETCH_ASSOC);
				$oSth = Db::getInstance()->prepare("SELECT p.lat,p.lng FROM datasets d JOIN points p ON p.dataset_id=d.id WHERE d.id=:id ORDER BY p.lat+p.lng DESC LIMIT 1");
				$oSth->bindParam(':id', $this->iId);
				$oSth->execute();
				$aBoundNe = $oSth->fetchAll(PDO::FETCH_ASSOC);
			}
		}
		catch (PDOException $oE) {
			die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
		}
		return array('success' => true, 'dataset' => $aDataset, 'points' => $aPoints, 'max' => $iMax, 'sw' => $aBoundSw[0], 'ne' => $aBoundNe[0]);
	}

	protected function _savePoints($sSource_file, $sDelimiter = ",", $iMax_line_length = 70, $sEnclosure = '"') {
		if (($handle = fopen($sSource_file, "r")) !== FALSE) {
			try {
				$sQuery = "
                INSERT INTO points (lat,lng,value,dataset_id) 
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
					$oSth = Db::getInstance()->prepare("DELETE FROM datasets WHERE id=:id");
					$oSth->bindParam(':id', $this->iId);
					$oSth->execute();
					$oSth = Db::getInstance()->prepare("DELETE FROM points WHERE dataset_id=:dataset_id");
					$oSth->bindParam(':dataset_id', $this->iId);
					$oSth->execute();
					die(json_encode(array('success' => false, 'error' => 'Adatbázis hiba!', 'debugMessage' => $oE->getMessage())));
				}
			}
			fclose($handle);
			return array('rowNum' => $iRowNum, 'importedRowNum' => $iImportedRowNum);
		}
		die(json_encode(array('success' => false, 'error' => 'A feltöltött fájl nem nyitható meg!')));
	}

	protected function filterAndMove() {
		$oSth = Db::getInstance()->query('SELECT lat,lng,value FROM points WHERE dataset_id=:dataset_id ORDER BY lat ASC');
		$oSth->bindParam(':dataset_id', $this->iId);
		$aPoints = $oSth->execute();

		$lat = 0;
		$lng = 0;
		$rad = 0;
		return array('success' => true, 'points' => $aPoints, 'center' => array('lat' => $lat, 'lng' => $lng, 'radius' => $rad));

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