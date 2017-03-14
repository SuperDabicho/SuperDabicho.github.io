function guardarPuntuacion(){
	console.log('entra');
	//Mediante esta funcion enviamos los datos a la funcion de php de guardar.php
    //var person = prompt("Nombre", "");

		var record = getRecord();
	    $.ajax({
	       url: "scripts/guardar.php",
	       type: "post",
	       data: {"record" :record},
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
           record = data;
       }
    });
}