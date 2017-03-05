/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {},
	numCartas=16,
	estado = 0,
	cartas = new Array(),
	encontradas = 0,
	levantada = false,
	cartaLevantada = null,
	clickOn=true,
	score = 60,
	intervalID = 0;

function botonReinicio(){
	var but = document.createElement("button");
	but.id = 'reinicio';
	but.innerHTML = "Reiniciar";
	document.getElementById('gamecontainer').appendChild(but);
	var aux = (document.getElementById('canvas').offsetWidth/2) - (document.getElementById('reinicio').offsetWidth/2);
	document.getElementById('reinicio').style.left = aux;
	document.getElementById('reinicio').addEventListener("touchstart", handlerReinicio);
	document.getElementById('reinicio').addEventListener("click", handlerReinicio);
}
function handlerReinicio(){
	start();
	removeReinicio();
}

function removeReinicio() {
    var elem = document.getElementById('reinicio');
    elem.parentNode.removeChild(elem);
    return false;
}

function reset(){
	MemoryGame.initGame();
}
	
/**
 * Constructora de MemoryGame (aqui todas las funciones)
 */
MemoryGame = function(gs) {
	
	this.initGame = function(){
		cartas = new Array();
		estado = 0;
		encontradas = 0;
		levantada = false;
		cartaLevantada = null;
		clickOn=true;
		score = 60;
		intervalID = 0;
		
		for (var i=0; i<2;i++){
			cartas.push(new MemoryGameCard("rebels"));
			cartas.push(new MemoryGameCard("empire"));
			cartas.push(new MemoryGameCard("hydra"));
			cartas.push(new MemoryGameCard("shield"));
			cartas.push(new MemoryGameCard("ring"));
			cartas.push(new MemoryGameCard("triforce"));
			cartas.push(new MemoryGameCard("spartan"));
			cartas.push(new MemoryGameCard("capsule"));
		}
		shuffle(cartas);
		this.loop();
	};
	
	this.draw = function(){
		var string;
		if(estado == 0)	string= "Memory Game! "+score;
		else if(estado == 1)	string = "Match found! "+score;
		else if(estado == 2)	string = "Try again! "+score;
		else if(estado == 3){
			string = "You win this time... "+score;
			botonReinicio();
			if(score > best) best=score;
		}
		else if(estado == 4){
			string = "You lose! "+score;
			botonReinicio();
		}
		gs.drawMessage(string);
		
		for(var i=0; i<numCartas; i++){
			cartas[i].draw(gs, i);
		}
		if(estado==3 || estado==4){
			clearInterval(intervalID);
		}
	};
	
	this.loop = function(){
		var self=this;
		intervalID = setInterval(self.draw, 16);
	};
	
	this.onClick = function(posCard){	//si levantada=true, hay una carta levantada. despues de levantar la segunda hay que ponerlo a false de nuevo.
		var carta = cartas[posCard];
		if(posCard != null && posCard >=0 && clickOn && estado!=4){
			if(!carta.vista){
				if(levantada){
					if(carta != cartaLevantada){
						carta.flip();
						carta.compareTo(cartaLevantada);
						levantada = false;
					}
				}else{
					carta.flip();
					cartaLevantada = carta;
					levantada = true;
				}
			}
		}
	};

};

/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	this.sprite = id; 
	this.vista = false;
	this.encontrada = false;
		
	this.flip = function(){
		if(this.vista===true) this.vista=false;
		else this.vista=true;
	};
	
	this.found = function(){
		encontrada = true;
		encontradas++;
	};
	
	this.compareTo = function(otherCard){
		var self = this;
		if(otherCard.sprite === this.sprite){
			this.found();
			otherCard.found();
			score += 5;
			if(encontradas >= numCartas) estado = 3;
			else estado = 1;
		}else{
			clickOn=false;
			setTimeout(function(){
				self.flip();
				otherCard.flip();
				clickOn=true;
			}, 900);
			score -= 10;
			if(score > 0){ estado = 2;}
			else{ estado = 4; score = 0;}
		}
		levantada=false;
	};
	
	this.draw = function(gs, pos){
		if(this.vista===true)	gs.draw(cartas[pos].sprite, pos);
		else gs.draw("back", pos);
	};
	
};

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
