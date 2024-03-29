<?php

/*
 * Az ajax-os hívásokat kezelő osztály
 * 
 * 
 */

class siteController {

	public static function dispatch() {
		$aRequest = $_REQUEST;
		$sMethod = isset($_REQUEST['method']) ? trim($_REQUEST['method']) : '';
		if ($sMethod && method_exists('siteController', $sMethod)) {
			die(json_encode(call_user_func(array('siteController', $sMethod), $aRequest)));
		}
		else {
			die(json_encode(array('success' => false, 'error' => 'Nem létező funkció!')));
		}
	}

	protected static function uploadDataset($aRequest) {
		$bSuccess = false;
		$sError = '';
		$sMsg = '';

		$sDatasetName = trim($aRequest['datasetName']);
		$aFile = $_FILES['uploadData'];
		if (is_uploaded_file($aFile['tmp_name'])) {
			$oDataset = new dataset(false, $sDatasetName);
			if ($aFile && $aFile['error'] != 0) {
				$sError = 'Hiba a fájl feltöltése közben';
			}
			elseif ($aFile && !dataset::isValidCsvMimeType($aFile)) {
				$sError = 'Nem megfelelő a kiválasztott fájl típusa!';
			}
			else {
				$iImportResults = $oDataset->import($aFile['tmp_name']);
				$bSuccess = true;
			}
		}
		else {
			$sError = '';
		}
		return array('success' => $bSuccess, 'error' => $sError, 'nums' => $iImportResults, 'datasetId' => intval($oDataset->getId()));
	}

	protected static function processDataset($aRequest) {
		$iDatasetId = isset($aRequest['datasetId']) ? intval($aRequest['datasetId']) : NULL;
		$oDataset = new dataset($iDatasetId);
		if ($iDatasetId) {
			return $oDataset->process();
		}
		else {
			return array('success' => false, 'error' => 'Hibás funkció használat!');
		}
	}

	protected static function getDatasetList($aRequest) {
		$iPage = intval($aRequest['page']);
		return dataset::getDatasetList($iPage);
	}

	protected static function loadDataset($aRequest) {
		$iId = intval($aRequest['id']);
		if ($iId) {
			$oDataset = new dataset($iId);
			return $oDataset->load();
		}
		else {
			return array('success' => false, 'error' => 'Nem adott meg adatsor azonosítót!');
		}
	}

	protected static function generateParam($aRequest) {
		global $CONF;
		$aValues = $aRequest['values'];
		foreach ($aValues as &$val) {
			$val = str_replace(',', '.', $val);
		}

		$sCsvFileName = $CONF['var_path'] . "parameterek.csv";
		@unlink($sCsvFileName);
		$handle = fopen($sCsvFileName, 'w');
		fputcsv($handle, array_keys($aValues));
		fputcsv($handle, array_values($aValues));
		fclose($handle);

		$sUrl = $CONF['ajax_url'] . "?method=getParamFile";
		die(json_encode(array('success' => true, 'url' => $sUrl)));
	}

	protected static function getParamFile($aRequest) {
		global $CONF;
		$sCsvFileName = $CONF['var_path'] . "parameterek.csv";
		header('Content-type: text/csv');
		header("Content-Disposition: attachment; filename=parameterek.csv");
		header("Pragma: no-cache");
		header("Expires: 0");
		header('Content-length: ' . filesize($sCsvFileName));
		readfile($sCsvFileName);
		exit();
	}

}

?>
