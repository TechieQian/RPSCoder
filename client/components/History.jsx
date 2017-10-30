import React, {Component} from 'react'
import {connect} from 'react-redux'

class History extends Component{
	render() {
		const history = this.props.history
		return (
			<div>
				<h3> Match History </h3>
				{
					history.map((round,index)=> {
						return (
							<div key={+index} className='panel panel-default'>
								<div className='panel-heading'>
									Round : {+index + 1}
								</div>
								<div className='panel-body'>
									{round.winner && 
										<ul className='list-group'>
											<li className='list-group-item'>Winner : {round.winner.player} </li>
											<li className='list-group-item'>Move : {round.winner.move} </li>
										</ul>
									}
									{round.tie &&    
										<ul className='list-group'>
											<li className='list-group-item'>Tie</li>
											<li className='list-group-item'>Move : {round.tie[0].move} </li>
										</ul>
									}
								</div>
							</div>
						)
					}) 
				}
			</div>
		)
	}
}

function mapState({history}) {
	return {
		history
	}
}

export default connect(mapState)(History)
