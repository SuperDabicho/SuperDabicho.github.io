<?php
	
	$file = fopen("record.txt", "r");
	$recordMundial= 0;
	
	while(!feof($file)) {
		$recordMundial = fgets($file);
	}
	fclose($file);
	echo $recordMundial;
	
?>
