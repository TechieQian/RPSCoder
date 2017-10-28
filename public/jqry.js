$(document).ready(function() {
	$("#submitcode").on('click', (btn)=> {
		const usercode = $("#guestcode").val()
		runCode(usercode)
	})
})

function reportResult(result) {
	console.log('reporting result', result)
}


function runCode(userCode) {
	let trimmed = userCode.trim()
	console.log('usercode is ', trimmed)
	const rawCode = `return ${trimmed}.call(this, 2)` 
	console.log(rawCode)
	caja.load(
		undefined,
		undefined,
		function(frame) {
			frame.code(
				'http://example.com/default.js',  // dummy URL
				'application/javascript',
				rawCode
				)
				.run(function(result) {
					if(result) {
						socket.emit('newPlayer')
						reportResult(result)
					}
				 });
		}); 
}
