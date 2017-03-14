<?php
	
	$file = fopen("record.txt", "r");
	$recordPersonal =  $_POST['record'] ;
	$recordMundial = 0;
	while(!feof($file)) {
		$recordMundial = fgets($file);
	}
	fclose($file);
	$file = fopen("record.txt", "w");
	if($recordPersonal > $recordMundial){
		fwrite($file, $recordPersonal);
	}
	fclose($file);
	
?>
