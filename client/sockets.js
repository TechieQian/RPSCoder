export function newPlayerSub(cb) {
  socket.on('waitPlayer', playerName => cb(playerName));
	//socket.emit('subscribeToTimer', 1000);
}
