var KEY_ENTER = 13, 
	KEY_LEFT = 37, 
	KEY_UP = 38, 
	KEY_RIGHT = 39, 
	KEY_DOWN = 40,
	
	canvas = null, 
	ctx = null, 
	lastPress = null, 
	pause = true, 
	x = 50, 
	y = 50,
	player = null,
	puerta = null,
	diana = null,
	puntos = 0,
	numPuertas = 0,
	dir = 1,
	puntosNuevos = 0,
	xPuntos=0;
	yPuntos=0;
	gameover = false; 

function Rectangle(x, y, width, height) { 
	this.x = (x == null) ? 0 : x; 
	this.y = (y == null) ? 0 : y; 
	this.width = (width == null) ? 0 : width; 
	this.height = (height == null) ? this.width : height; 
	this.intersects = function (rect) { 
					if (rect == null) { 
						window.console.warn('Missing parameters on function intersects'); 
					} else { 
						return (this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.y + this.height > rect.y); 
					} 
				}; 
	this.fill = function (ctx) { 
					if (ctx == null) { 
						window.console.warn('Missing parameters on function fill'); 
					} else { 
						ctx.fillRect(this.x, this.y, this.width, this.height); 
					} 
				};
}

function random(max) { 
		return Math.floor(Math.random() * max);
}
	
window.requestAnimationFrame = (function () { 
					return window.requestAnimationFrame || 
						window.mozRequestAnimationFrame || 
						window.webkitRequestAnimationFrame ||
						function (callback) { 
							window.setTimeout(callback, 10); 
						}; 
				}()); 

document.addEventListener('keydown', function (evt) { 
					lastPress = evt.which; 
				}, false); 

function paint(ctx) { 
	// Clean canvas 
	ctx.fillStyle = '#000'; 
	ctx.fillRect(0, 0, canvas.width, canvas.height); 
	
	//Player
	ctx.fillStyle = '#0f0'; 
	player.fill(ctx);

	//Puerta y diana
	ctx.fillStyle = '#898989';
	puerta.fill(ctx);
	ctx.fillStyle = '#000';
	diana. fill(ctx);
	
	//Puntos
	ctx.fillStyle = '#fff'; 	
	ctx.fillText('Puntos: ' + puntos, 0, 10);
	
	// Draw pause 
	if (pause) { 
		ctx.textAlign = 'center';
		ctx.font="80px Arial";
		ctx.shadowColor = '#f00'
		if(gameover){
			ctx.fillText('GAMEOVER', 300, 150);
		}else{
			ctx.fillText('PAUSE', 300, 150); 
		}
		ctx.font="14px Arial";
		ctx.textAlign = 'left'; 
	}
	//mostrar los puntos ganados
	ctx.fillText('+'+puntosNuevos, xPuntos, yPuntos);
	
} 

function reset() { 
	puntos = 0;
	numPuertas = 0;
	dir = 1; 
	player.x = 40; 
	player.y = 40;
	puerta.width = 30; 
	puerta.height = 10; 
	puerta.x = (random(canvas.width / 10 - 2) * 10)+10;
	puerta.y = (random(canvas.height / 10 - 2) * 10)+10;
	diana.x = puerta.x + 10;
	diana.y = puerta.y;
	gameover = false; 
}

function act() { 
	if (!pause) {
		if(gameover) reset();
	
		// Change Direction 
		if (lastPress == KEY_UP) { dir = 0; } 
		if (lastPress == KEY_RIGHT) { dir = 1; } 
		if (lastPress == KEY_DOWN) { dir = 2; } 
		if (lastPress == KEY_LEFT) { dir = 3; } 
		
		// Move Rect 
		if (dir == 0) { player.y -= 10; } 
		if (dir == 1) { player.x += 10; } 
		if (dir == 2) { player.y += 10; } 
		if (dir == 3) { player.x -= 10; }
		
		// Out Screen 
		if (player.x >= canvas.width) { player.x -= 10; pause = true; gameover = true; } 
		if (player.y >= canvas.height) { player.y -= 10; pause = true; gameover = true; } 
		if (player.x < 0) { player.x = 0; pause = true; gameover = true; } 
		if (player.y < 0) { player.y = 0; pause = true; gameover = true; } 
		
		if(player.intersects(puerta) || player.intersects(diana)){

			if(player.intersects(diana)){
				puntos += 10;
				puntosNuevos=10;
			}else{
				puntos += 5;
				puntosNuevos = 5;
			}
			numPuertas++;
			xPuntos = puerta.x - 10;
			yPuntos = puerta.y - 10;
			
			var orientacion = random(2);
			if(orientacion == 1){ 
				puerta.width = 30; 
				puerta.height = 10; 
				puerta.x = (random(canvas.width / 10 - 3) * 10) + 10; //-2 y -3 para evitar que la diana no esté en pegada a la pared
				puerta.y = (random(canvas.height / 10 - 2) * 10) + 10;
				diana.x = puerta.x + 10;
				diana.y = puerta.y;
			}
			else if(orientacion == 0){ 
				puerta.width = 10; 
				puerta.height = 30; 
				puerta.x = (random(canvas.width / 10 - 2) * 10) + 10;
				puerta.y = (random(canvas.height / 10 - 3) * 10) + 10;
				diana.x = puerta.x;
				diana.y = puerta.y + 10;
			}
		}
	} 
		// Pause/Unpause 
	if (lastPress == KEY_ENTER) { 
		pause = !pause; 
		lastPress = null; 
	} 
}

function repaint() { 
	window.requestAnimationFrame(repaint); 
	paint(ctx); 
}
 
function run() { 
	setTimeout(run, 75/(1+(numPuertas/10))); 
	act();	
} 

function init() { 
	// Get canvas and context 
	canvas = document.getElementById('canvas'); 
	ctx = canvas.getContext('2d'); 
	
	player = new Rectangle(40, 40, 10, 10);
	diana = new Rectangle(80, 90, 10, 10);
	puerta = new Rectangle(80, 80, 10, 30);
	
	// Start game 
	run(); 
	repaint(); 
}

window.addEventListener('load', init, false);