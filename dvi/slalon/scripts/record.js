function guardarPuntuacion(){
	console.log('entra');
	//Mediante esta funcion enviamos los datos a la funcion de php de guardar.php
    //var person = prompt("Nombre", "");

	var re = getRecord();
	$.ajax({
	   url: "scripts/guardar.php",
	   type: "post",
	   data: {"record" :re},
	   success: function(data){}
	});
	
}

function leerPuntuacion(){
    $.ajax({
       url: "scripts/leerRecord.php",
       type: "post",
       data: "data",
       success: function(response){
           $("#recordMundial").html("Récord mundial: "+response);
           rec = data;
       }
    });
}