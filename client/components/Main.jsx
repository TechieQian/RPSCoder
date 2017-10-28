import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import History from './History'
import Instructions from './Instructions'

class Main extends Component {
	render() {
		return (
			<div className='container'>
				<h1>RPS Coder</h1>
				<Instructions />
				<div className='row'> 
					<div className='col-sm-6'>
						<CodeEditor />
					</div>
					<div className='col-sm-4 pull-right'>
						<History />
					</div>
				</div>
			</div>
		)
	}
}

export default Main
