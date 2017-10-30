const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const path = require('path')
const socket = require('socket.io')
const uuidv4 = require('uuid/v4');
const Game = require('./Game')

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

// static middleware
app.use(express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static(path.join(__dirname, '..', 'public')))


// server socket
io.sockets.on('connection', function (socket) {
	socket.on("newPlayer", function(data) {
		openGame.addPlayer({data, socket})
		if (openGame.players.length === 1) {
			console.log('emitting waiting')
			socket.broadcast.emit('waiting', openGame.players[0].name)
		}
		if (openGame.players.length === 2) {
			openGame.playGame(io)
			openGame = new Game(uuidv4())
		}
	});
});

let openGame = new Game(uuidv4())
