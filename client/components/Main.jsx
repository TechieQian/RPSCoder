import React, {Component} from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

class Main extends Component {
	constructor() {
		super()
		this.state = { codeText : "" }
		this.runCode = this.runCode.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	runCode(e) {
		e.preventDefault()
		const userCode = this.state.codeText
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

	handleChange(code) {
		console.log('changing?')
		console.log(code)
    this.setState({codeText : code});
	}

	render() {
		return (
			<div> 
				<h1>RPS Coder</h1>
	      <form onSubmit={this.runCode}>
				  <AceEditor
						mode="javascript"
						theme="monokai"
						fontSize={24}
						height='300px'
						tabSize={2}
						value={this.state.codeText}
						onChange={this.handleChange}
						editorProps={{$blockScrolling: true}}
					/>
					<br />
					<button 
						className='btn btn-primary'
						id="submitcode"> 
						Submit code 
					</button>
      	</form>
			</div>
		)
	}
}

export default Main
