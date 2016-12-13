# React Redux Dynamic Router Reducer Plugin

Redux plugin for react router to run dynamic reducer

## Uses

```javascript

import { createStore, /* combineReducers */ } from 'redux'
import { connect } from 'react-redux'

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

class Foo extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.props.initial() // !!IMPORTANT, You should call dispatch to get new store by yourself
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.state.stateReducer !== this.props.state.stateReducer
  }
  render() {
    return (
      <div>
        Page: Foo
        <div>
          <button onClick={ this.props.incretment }>{ this.props.state.stateReducer }</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state: state
  }
}

const ConnectFoo = connect(
  mapStateToProps,
  {
    initial: () => {
      return {
        type: '@@INIT'
      }
    },
    incretment: () => {
      return {
        type: 'INCRETMENT'
      }
    }
  }
)(Foo)

```
