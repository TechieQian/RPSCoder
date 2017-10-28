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
			codeText : "function(history) { return 'rock'}", 
			playerName : "player name",
			result : "",
			challenger : "",
			joinDisable : false
		}
		this.joinGame = this.joinGame.bind(this)
		this.runCode = this.runCode.bind(this)
		this.editorChange = this.editorChange.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.saveResult = this.saveResult.bind(this)
		this.roundDone = this.roundDone.bind(this)
		this.waiting = this.waiting.bind(this)
	}

	componentDidMount() {
		socket.on('runOnce', this.runCode) 
		socket.on('roundDone', this.roundDone)
		socket.on('waiting', data=> {
			this.setState( { challenger : data } )
		})
	}

	componentWillReceiveProps(props) {
		if (props.history.length != this.props.history.length) {
			console.log('received props')
			socket.emit('historyUpdated')
			this.setState({joinDisable : false})
		}
	}

	roundDone() {
		axios.get(`/history`)
			.then(history=>history.data)
			.then(history=> {
				this.props.updateHistory(history)
      })
	}

	saveResult(result) {
		this.setState({result})
			socket.emit('newResult', {
				playerName  : this.state.playerName,
				result : this.state.result
			})
	}

	waiting() {
		console.log('waiting for opponent')
	}

	joinGame(e) {
		e.preventDefault()
		this.setState({joinDisable : true} )
		const userCode = this.state.codeText
		const playerName = this.state.playerName
		socket.emit('newPlayer', {playerName})
	}

	runCode() {
		if ( this.state.challenger ) {
			this.setState({challenger : ""})
		}
		console.log('running code!')
		const userCode = this.state.codeText
		const playerName = this.state.playerName
		const history = JSON.stringify(this.props.history)
		const saveResult = this.saveResult
		let trimmed = userCode.trim()
		const rawCode = `return ${trimmed}.call(this, ${history})` 
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
			<div className='row'>
				{ this.state.challenger && 
						<div className="alert alert-info">
							Challenger {this.state.challenger} is waiting for you!
						</div>
				}
				<form onSubmit={this.joinGame}>
					<input
						name='playerName'
						className='form-control'
						value={this.state.playerName}
						onChange={this.handleChange}
					/>
					<br />
				  <AceEditor
						mode="javascript"
						theme="monokai"
						fontSize={24}
						height='300px'
						width='600px'
						tabSize={2}
						value={this.state.codeText}
						onChange={this.editorChange}
						editorProps={{$blockScrolling: true}}
					/>
					<br />
					<button 
						className='btn btn-primary'
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
