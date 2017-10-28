const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const path = require('path')
const socket = require('socket.io')

//Start server
const app = express()
const server = app.listen(port, ()=> {
	console.log(`listening on ${port}`)
})
const io = socket(server)


app.get('/', (req,res)=>{
	res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})


// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('morgan')('dev'))

app.get('/history', (req,res)=> {
	res.json(history)
})

// static middleware
app.use(express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static(path.join(__dirname, '..', 'public')))

io.sockets.on('connection', function (socket) {
	socket.on("newPlayer", function(data) {
		game.addPlayer(data)
		console.log(`${data.playerName} has joined`)
		if (game.players.length === 1) {
			console.log('emitting waiting')
			socket.broadcast.emit('waiting', game.players[0].playerName)
		}
		if (game.players.length === 2) {
			io.sockets.emit('runOnce')
		}
		console.log(game.players)
	});
	socket.on('newResult', function(data){
		game.buffer.push(data)
		if (game.buffer.length === 2) {
			game.resolve()
			io.sockets.emit('roundDone')
		}
	})

	socket.on('historyUpdated', function(data) {
		game.buffer.push('clientupdated')
		if (game.buffer.length === 2) {
			game.buffer = []
			game.turns--
			console.log('game turns', game.turns)
			if (game.turns > 0  ){
				console.log('emitting run once again!!')
				io.sockets.emit("runOnce")
			}
			else {
				console.log('GAME IS DONE')
				game = new Game()
				history = []
			}
		}
	})
});

// server logic


class Game {
	constructor() {
		this.players = []
		this.buffer = []
		this.turns = 10
	}
	addPlayer(player) {
		this.players.push(player)
	}
	resolve() {
		console.log('resolving the game')
		const p1 = this.buffer.pop()
		const p2 = this.buffer.pop()
		if (p1.result.length > p2.result.length) {
			console.log(p1.playerName + ' wins')
			history.push({
				"winner" : { 'player' : p1.playerName, 'move' : p1.result },
				"loser" : { 'player' : p2.playerName, 'move' : p2.result }
			})
		}
		else if ( p1.result.length < p2.result.length ) {
			console.log(p2.playerName + " wins")
			history.push({
				"winner" : { 'player' : p2.playerName, 'move' : p2.result },
				"loser" : { 'player' : p1.playerName, 'move' : p1.result }
			})
		}
		else {
			console.log('no winner?')
			history.push({
				"tie" : [{ 'player' : p2.playerName, 'move' : p2.result },
								{ 'player' : p1.playerName, 'move' : p1.result }]
			})
		}
	}

}
let game = new Game()
let history = [];
