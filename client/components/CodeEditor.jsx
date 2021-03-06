import React, {Component} from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';
import {connect} from 'react-redux'
import {setHistory} from '../store.js'
import axios from 'axios'
import 'brace/mode/javascript';
import 'brace/theme/monokai'

class CodeEditor extends Component {
	constructor() {
		super()
		this.state = { 
			codeText : `function RPS(helper) {
	return 'rock'
}`, 
			playerName : "player name",
			result : "",
			challenger : "",
			winner : "",
			joinDisable : false
		}
		this.joinGame = this.joinGame.bind(this)
		this.runCode = this.runCode.bind(this)
		this.editorChange = this.editorChange.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.saveResult = this.saveResult.bind(this)
		this.roundDone = this.roundDone.bind(this)
	}

	componentDidMount() {
		const updateHistory = this.props.updateHistory
		socket.on('runOnce', this.runCode)
		socket.on('roundDone', this.roundDone)
		socket.on('waiting', data=> {
			this.setState( { challenger : data } )
		})
		socket.on('gameOver', data=> {
			console.log('winner is', data)
			this.setState( { challenger : "", joinDisable : false, result : "", winner : data } )
		})
	}

	//A little hack to make sure the client state is updated before emitting historyUpdated
	
	componentWillReceiveProps(props) {
		if (props.history.length > this.props.history.length) {
			console.log('Last Round: ', props.history[props.history.length-1])
			socket.emit('historyUpdated')
		}
	}

	roundDone() {
		const updateHistory = this.props.updateHistory
		socket.emit('getHistory', function(history){
			updateHistory(history)
		})
	}

	saveResult(result) {
		console.log('i played move', result)
		this.setState({result})
		socket.emit('newResult', {
			playerName  : this.state.playerName,
			result : this.state.result
		})
	}

	//Clicking a button to join the game. Emits newPlayer to the server.
	
	joinGame(e) {
		e.preventDefault()
		this.setState({joinDisable : true} )
		this.props.updateHistory([])
		const userCode = this.state.codeText
		const playerName = this.state.playerName
		socket.emit('newPlayer', {playerName})
	}

	//Connects to Google caja server to run code safely. Save the result of the executed code.
	
	runCode() {

		//helper objects
		const history = this.props.history
		const prevRound = history.length? history[history.length-1] : null
		const helper = {
			"PRE_ROUND" : prevRound,
			"HISTORY"		: history,
			"MOVE"			: ['rock', 'paper', 'scissors']
		}

		this.setState({challenger : "", winner : ""})
		const userCode = this.state.codeText
		const playerName = this.state.playerName
		const helperString = JSON.stringify(helper)
		const saveResult = this.saveResult
		let trimmed = userCode.trim()
		const rawCode = `return ${trimmed}.call(this, ${helperString})` 
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
							saveResult(result)
						}
						else {
							saveResult('rock')
						}
					 });
			})
	 }

	editorChange(code) {
    this.setState({codeText : code});
	}

  handleChange(e) {
    this.setState({[e.target.name] : e.target.value})
  }

	render() {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-sm-4'>
						<input
							name='playerName'
							className='form-control'
							value={this.state.playerName}
							onChange={this.handleChange}
						/>
						<br />
					</div>
					<div className='col-sm-8'>
					{ 
						this.state.challenger && 
						<div className="alert alert-info">
							Challenger {this.state.challenger} is waiting for you!
						</div>
					}
					{ 
						this.state.winner && 
						<div className="alert alert-success">
							{this.state.winner} won!
						</div>
					}
					</div>
				</div>
				<form onSubmit={this.joinGame}>
				  <AceEditor
						mode="javascript"
						theme="monokai"
						fontSize={24}
						height='300px'
						width='100%'
						tabSize={2}
						value={this.state.codeText}
						onChange={this.editorChange}
						editorProps={{$blockScrolling: true}}
					/>
					<br />
					<button 
						className='btn btn-primary btn-block'
						disabled={this.state.joinDisable}
						id="submitcode"> 
						Join
					</button>
      	</form>
			</div>
		)
	}
}

function mapState({history}){
	return {
		history
	}
}

function mapDispatch(dispatch) {
	return {
		updateHistory : (history)=> { dispatch(setHistory(history)) }
	}
}

export default connect(mapState, mapDispatch)(CodeEditor)
