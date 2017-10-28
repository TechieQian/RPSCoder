'use strict';

// JS doesn't have interface as it's not based on strong-typed classes. It implements duck-typing.
// For simplicity, I'm going to use extend in Javascript, with full knowledge that my IDealer class
// is not really an interface and is an entirely different OOP concept. 

class IDealer {
	constructor() {
		this.startGame = undefined
		this.servedPlayers = undefined 
	}
}

// For the sake of making it resemble interface, we're not using Javascript protocol methods.
// Just instance methods within the constructor. Again not technically accurate, but we can discuss.

class Dealer extends IDealer {
	constructor() {
		super()
		this.servedPlayers = []
		this.startGame = function () {
			console.log('game start')
		}
	}
}


// JS has no enums either. In true JS fashion, its a JS obj. 

const RPSMove = {
	"ROCK" 			: 1,
	"PAPER"  		: 2,
	"SCISSORS" 	: 3
}

function generateUUID () { // Public Domain/MIT
	var d = new Date().getTime();
	if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
			d += performance.now(); //use high-precision timer if available
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}
const rocky = new Dealer()
rocky.startGame()
