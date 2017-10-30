// a new result is done calculating by Google caja.
// resolve to see who won. Then emit round done.
const newResultListener = function(data) {
	this.buffer.push(data)
	if (this.buffer.length === 2) {
		this.resolve()
		this.io.to(this.roomId).emit('roundDone')
	}
}

// Before moving onto the next round, verify the history is first updated.
// All clients should have the latest history.

const historyUpdatedListener = function(data) {
	this.buffer.push('clientupdated')
	if (this.buffer.length === 2) {
		this.buffer.pop()
		this.buffer.pop()
		this.turns--
		if (this.turns > 0  ){
			this.io.to(this.roomId).emit('runOnce')
		}
		else {
			console.log('game over')
			this.io.to(this.roomId).emit('gameOver',this.determineWinner())
			this.endGame()
		}
	}
}

// callback client function with latest history in the server.

const getHistoryListener = function(cb) {
	cb(this.history)
}

module.exports = {
	newResultListener,
	historyUpdatedListener,
	getHistoryListener
}
