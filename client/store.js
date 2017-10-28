import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

const SET_HISTORY = "SET_HISTORY"

export function setHistory(history) {
  return {
    type : SET_HISTORY,
    history
  }
}

const defaultState = {
	history : []
}

const reducer = function(state = defaultState, action) {
	switch(action.type) {
		case SET_HISTORY : 
			return Object.assign({}, state, { history: action.history })
		default : return defaultState
	}
}


export default createStore(reducer, applyMiddleware(thunk, createLogger()))
