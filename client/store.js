import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

const reducer = function(state = {}, action) {
	switch(action.type) {
			default : return state
	}
}

export default createStore(reducer, applyMiddleware(thunk, createLogger()))
