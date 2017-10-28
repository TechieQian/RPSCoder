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

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Middleware
app.use(require('morgan')('dev'))

// static middleware
app.use(express.static(path.join(__dirname, '..', 'node_modules')))
app.use(express.static(path.join(__dirname, '..', 'public')))

io.sockets.on('connection', function (socket) {
	console.log('socket connection')
	socket.on("newPlayer", function() {
		console.log('new player has joined')
		playerCount++
		console.log(playerCount)
  });
});

// server logic

let playerCount = 0
