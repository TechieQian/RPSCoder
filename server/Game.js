const listeners = require('./listeners')
module.exports =  class Game {

	constructor(roomId) {
		this.roomId = roomId
		this.players = []
		this.sockets = []
		this.buffer = []
		this.history = []
		this.results = []
		this.turns = 20
		this.RPSTable = {
			"paper" : "rock",
			"rock"	: "scissors",
			"scissors" : "paper"
		}
	}

	//Star the game. Map the sockets and emit the event to run code.

	playGame(io) {
		this.io = io
		this.mapSockets(io)
		io.to(this.roomId).emit('runOnce');
	}

	//End the game. Leave the socket room and remove all listeners.
	//TODO: For efficiency the game should be able to restart.
	
	endGame() {
		this.sockets.map(function(socket) {
			socket.leave(this.roomId)
			socket.removeAllListeners('newResult')
			socket.removeAllListeners('historyUpdated')
			socket.removeAllListeners('getHistory')
		}.bind(this))
	}

	//Map all the sockets to their respective listeners.
	//For some reason, we need to remove the listener and re-add for each game to not get 
	//duped messages.

	mapSockets(io) {
		this.sockets.map(function(socket) {
			socket.on('newResult', listeners.newResultListener.bind(this))
			socket.on('historyUpdated', listeners.historyUpdatedListener.bind(this))
			socket.on('getHistory', listeners.getHistoryListener.bind(this))
		}.bind(this))
	}

	//Add a player, along with his socket to the current game.
	
	addPlayer({data, socket}) {
		socket.join(this.roomId)
		this.sockets.push(socket)
		console.log(`${data.playerName} has joined ${this.roomId}`)
		this.players.push({ name : data.playerName , roundsWon : 0 })
	}

	//Resolve the game to determine who wins the round.
	resolve() {
		const p1 = this.buffer.find(player=>player.playerName === this.players[0].name)
		const p2 = this.buffer.find(player=>player.playerName === this.players[1].name)
		this.buffer.pop()
		this.buffer.pop()
		if ( p1.result === p2.result ) {
			this.history.push({
				"tie" : [{ 'player' : p2.playerName, 'move' : p2.result },
								{ 'player' : p1.playerName, 'move' : p1.result }]
			})
		}
		else if (this.RPSTable[p1.result] === p2.result) {
			console.log(p1.playerName + ' p1 wins')
			this.players[0].roundsWon ++ 
			this.history.push({
				"winner" : { 'player' : p1.playerName, 'move' : p1.result },
				"loser" : { 'player' : p2.playerName, 'move' : p2.result }
			})
		}
		else {
			console.log(p2.playerName + " p2 wins")
			this.players[1].roundsWon++
			this.history.push({
				"winner" : { 'player' : p2.playerName, 'move' : p2.result },
				"loser" : { 'player' : p1.playerName, 'move' : p1.result }
			})
		}
	}
	determineWinner() {
		if (this.players.roundsWon === this.players[1].roundsWon) {
			return 'nobody...'
		}
		else if (this.players[0].roundsWon > this.players[1].roundsWon) {
			return this.players[0].name
		}
		else {
			return this.players[1].name
		}
	}
}
