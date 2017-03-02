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
	score = 60;

/**
 * Constructora de MemoryGame (aqui todas las funciones)
 */
MemoryGame = function(gs) {
	
	this.initGame = function(){
		
		for (var i=0; i<2;i++){
			cartas.push(new MemoryGameCard("8-ball"));
			cartas.push(new MemoryGameCard("potato"));
			cartas.push(new MemoryGameCard("dinosaur"));
			cartas.push(new MemoryGameCard("kronos"));
			cartas.push(new MemoryGameCard("rocket"));
			cartas.push(new MemoryGameCard("unicorn"));
			cartas.push(new MemoryGameCard("guy"));
			cartas.push(new MemoryGameCard("zeppelin"));
		}
		shuffle(cartas);
		this.loop();
	};
	
	this.draw = function(){
		var string;
		if(estado == 0)	string= "Memory Game - "+score;
		else if(estado == 1)	string = "Match found! - "+score;
		else if(estado == 2)	string = "Try again - "+score;
		else if(estado == 3)	string = "You win! ... this time - "+score;
		gs.drawMessage(string);
		
		for(var i=0; i<numCartas; i++){
			cartas[i].draw(gs, i);
		}
		
	};
	
	this.loop = function(){
		var self=this;
		setInterval(self.draw, 16);
	};
	
	this.onClick = function(posCard){	//si levantada=true, hay una carta levantada. despues de levantar la segunda hay que ponerlo a false de nuevo.
		var carta = cartas[posCard];
		if(posCard != null && posCard >=0){
			if(clickOn){
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
			estado = 2;
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
