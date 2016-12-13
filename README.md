# React Redux Dynamic Router Reducer Plugin

Redux plugin for react router to run dynamic reducer

## Uses

```javascript

import { createStore, /* combineReducers */ } from 'redux'

import { dynamicCombineReducers } from 'redux-plugin-dynamic-router-reducer' // instead of combineReducers
// required inport react router history
import { browserHistory } from 'react-router'

function todoReducer(state = [{ name: 'Bar', gender: 'boy' }], action) {
  switch(action.type) {
    case 'ADDTODO':
    return state.concat({ name: 'Foo', gender: 'boy' })
    default:
    return state
  }
}

function sumReducer(state = 0, action) {
  switch(action.type) {
    case 'INCRETMENT':
    return state + 1
    default:
    return state
  }
}

const store = createStore(dynamicCombineReducers({stateReducer, todoReducer},
  {
    dynamic: true,
    bindRule: [
      { key: 'todoReducer', pathname: 'bar' },
      { key: 'sumReducer', pathname: 'foo' }
    ],
    injectHistory: browserHistory
  }
))

```
