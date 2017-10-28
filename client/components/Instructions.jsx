import React, {Component} from 'react'

export default function Instructions() {
	return (
		<pre >
			Easy game. We will play Rock Paper Scissors for 20 rounds. You will write a function that returns either 'rock', 'paper', or 'scissors' <br /> 
			Don't worry. I have exposed an array called 'history' for you. <br />
			History begins as an empty array. But as the rounds go on, it will log the winner, loser, and their moves. <br />
			Here's the format for a single entry in history. <br /><br />
			{'{'} <br />
			winner : {'{'} player : playername , move : move {'}'},<br />
		  loser : {'{'} player : playername , move : move {'}'}<br />
			{'}'}<br /><br />
			If there's a tie, then winner and loser properties are not available. Only 'tie'<br />
			But you can easier access the move property that was tied. <br /><br />
			{'{'} <br />
			tie : [ array of player names and their moves ],<br />
		  move : move that resulted in tie<br />
			{'}'}<br /> <br />
			RESTRICTIONS : <br /> 
		- You cannot consolelog here. But I have exposed the above inside the client logs as well <br />
		- Ecmascript 6 is not supported <br />
		- You probably cannot comment code. <br />
		</pre>
	)
}
