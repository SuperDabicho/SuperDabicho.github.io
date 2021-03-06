// ---------------------------------
// Micro motor para dibujar sprites 
// y procesar eventos de ratón
// ---------------------------------

var canvas, // Canvas en el que dibujaremos el juego
	ctx,	// Contexto de dibujado
	gs,		// Servidor gráfico
	game,	// Juego
	best = -1,
	reset = false;

// Servidor gráfico ad-hoc para este juego
var CustomGraphicServer = function() {

	// Tamaño de los tiles que representan las cartas
	this.tileWidth = 80;
	this.tileHeight = 100;
	
	// Espacio vertical para colocar el mensaje de texto
	this.vOffset = 50;

	// Información sobre los tiles
	this.maps = { };
	
	/**
	 * Carga una hoja de sprites y ejecuta la función de callback
	 * @param  {String}   spriteSrc  Imagen que contiene los sprites
	 * @param  {[type]}   spriteData Datos referentes a los sprites contenidos en el fichero
	 * @param  {Function} callback   Función que se llamará tras cargar la hoja de sprites
	 */
	this.load = function (spriteSrc, spriteData, callback) {
		this.maps = spriteData;
		this.image = new Image();
		this.image.onload = callback;
		this.image.src = spriteSrc;
	};

	/**
	 * Dibuja un tile o carta en una determinada posición del tablero.
	 * El tablero es de 4x4, siendo la posición 0 la que se encuentra en la esquina superior izquierda
	 * @param  {string} tile     Identificador del sprite que representa la carta que queremos dibujar
	 * @param  {int} boardPos Posición dentro del tablero [0,15]
	 */
	this.draw = function(tile, boardPos) {
		var s = this.maps[tile];
		var xPos = boardPos%4 * this.tileWidth;
		var yPos = this.vOffset + (Math.floor(boardPos/4) * this.tileHeight);
		ctx.drawImage(this.image,
			s.x,
			s.y,
			s.w,
			s.h,
			xPos,
			yPos,
			this.tileWidth,
			this.tileHeight);
	};

	/**
	 * Convierte una posición (x,y) del canvas en la posición de una carta dentro del tablero
	 * @param  {double} x Posición x en coordenadas del canvas
	 * @param  {double} y Posición y en coordenadas del canvas
	 * @return {[type]}   Posición de la carta ([0,15]) dentro del tablero; o null si pulsamos fuera del tablero
	 */
	this.resolveCard = function(x,y) {
		var row = Math.floor((y-this.vOffset)/this.tileHeight);
		var col = Math.floor(x/this.tileWidth);
		var card = null;
		if (row<4 && col<4) {
			card = row*4+col;
		}
		return card;
	};


	/**
	 * Escribe un mensaje en el Canvas, en la posición destinada para ello
	 * @param  {string} message Mensaje que hay que escribir
	 */
	this.drawMessage = function(message) {
		ctx.rect(0, 0, canvas.width, this.vOffset);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.fillText("", canvas.width/2, 30);
		ctx.font = "30px Lobster";
		ctx.textAlign = "center";
		ctx.fillStyle = "#FFF";
		ctx.fillText(message, canvas.width/2, 30);
		ctx.fillStyle = "#FFF";
		if(best > 0){
			ctx.textAlign = "left";
			ctx.font = "10px Lobster";
			ctx.fillStyle = "#FFF";
			ctx.fillText('BEST: '+best, 2, 45);
		}
	};
};

/**
 * Función de inicialización del canvas
 * @param {string} container Id del contenedor donde meteremos el canvas
 * @param {int} width     Ancho del canvas en píxeles
 * @param {int} height    Alto del canvas en píxeles
 * @param {string} className Nombre de clase que usaremos para el canvas
 */
var InitCanvas = function(container, width, height, className) {
	var containerElement = document.getElementById(container);
	canvas = document.createElement("canvas");
    // Handle error here for old browsers
    canvas.width = width;
    canvas.height = height;
    canvas.className = className;
	canvas.id = className;
    ctx = canvas.getContext("2d");
    if(!ctx){
		window.alert("Update your browser!");
    }
    containerElement.appendChild(canvas);
};

/**
 * Función que inicia el juego. Una vez lanzada, comenzará todo el juego
 */
function start() {
	if(best < 0){
		InitCanvas("gamecontainer", 320, 460, "canvas");
		gs = new CustomGraphicServer();
		InputServer();
		game = new MemoryGame(gs);
	}
	gs.load("img/sprites.png",
		{
		"hydra": {"x":336,"y":406,"w":165,"h":200},
		"back": {"x":169,"y":406,"w":165,"h":200},
		"empire": {"x":2,"y":406,"w":165,"h":200},
		"triforce": {"x":336,"y":204,"w":165,"h":200},
		"spartan": {"x":169,"y":204,"w":165,"h":200},
		"shield": {"x":2,"y":204,"w":165,"h":200},
		"rebels": {"x":336,"y":2,"w":165,"h":200},
		"ring": {"x":169,"y":2,"w":165,"h":200},
		"capsule": {"x":2,"y":2,"w":165,"h":200}
		},
		function() {
			
			game.initGame();
		});
}

/**
 * Función que inicia las funciones responsables de interpretar los eventos de ratón y de touch
 * Cuando hacemos click con el ratón en el canvas resuelve en qué carta estamos pulsando y llama a 
 * la función onClick de MemoryGame, devolviendo el número de la carta en la que se ha pulsado (ver 
 * el método resolveCard del CustomGraphicServer)
 */
var InputServer = function() {

	var hasTouch = false;
	var clientToCard = function(x,y) {
		var canvasX = (x-canvas.clientLeft)*canvas.width/canvas.clientWidth;
		var canvasY = (y-canvas.clientTop)*canvas.height/canvas.clientHeight;
		var card = gs.resolveCard(canvasX, canvasY);
		game.onClick(card);
	};

	var handleMouse = function(evt) {
		if (hasTouch)
            return;
		clientToCard(evt.clientX, evt.clientY);
	};

	var handleTouch = function(evt) {
        hasTouch = true;
        clientToCard(evt.touches[0].pageX, evt.touches[0].pageY);
        //evt.preventDefault();
    };

	window.addEventListener("click", handleMouse);
	window.addEventListener("touchstart", handleTouch);

};

// Finalmente ejecutaremos la función start cuando se haya cargado la página
window.addEventListener("load", start);
//document.getElementById('reinicio').addEventListener("click", function(){ start(); removeReinicio(); });

