import React, {Component} from 'react'

export default function Instructions() {
	return (
		<div>
			<pre><code>{`Easy two player game. We will play Rock Paper Scissors for 20 rounds. You will write a function that returns either 'rock', 'paper', or 'scissors.' Once you hit join, your challenge will be "issued" to other people on this page. To best your opponent, I have exposed an array called 'history' for you. History starts empty. As the rounds go on, it logs the winner, loser, and their moves.

I have exposed an helper object for you. The helper object has 3 properties.

For example, to use the PRE_ROUND helper, invoke helper.PRE_ROUND

	1) PRE_ROUND - An object that gives you the result of the previous round. Returns null if first round.

		If there is a winner, then the round object will look like:

		{
			winner : { player : <playerName> , move : <move> },
			loser  : { player : <playerName> , move : <move> }
		}

		If its tied, then round object looks like:

		{
			tie : [ { player : <playerName> , move : <move> },{ player : playername , move : <move> }],
			move : ['rock' || 'paper' || 'scissors']
		}
	
	2) HISTORY - An array that has a history of all the rounds. Basically an array of historical PRE_ROUND objects. 

	3) MOVE - An array with moves. ['rock', 'paper', 'scissors']

RESTRICTIONS :  
	1) You cannot console.log here. Sorry! 
	2) Ecmascript 6 is not supported. Remember to use 'var'!

KNOWN BUGS : 
	1) If your code has some syntax or runtime err, your move is defaulted to 'rock'
	2) You will only see issued challenges only when on this page when challenge was issued 
			`}
		</code></pre>
		</div>

	)
}
