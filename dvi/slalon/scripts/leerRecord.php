<?php
	
	$file = fopen("record.txt", "r");
	$recordMundial="";
	
	while(!feof($file)) {
		$recordMundial = fgets($file);
	}
	fclose($file);
	echo $recordMundial;
	
?>
