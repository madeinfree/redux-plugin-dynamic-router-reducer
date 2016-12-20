# React Redux Dynamic Router Reducer Plugin

Redux plugin for react router to run dynamic reducer

## Installtion

```javascript
npm install redux-plugin-dynamic-router-reducer && history
```

## Uses

```javascript

import { createStore, /* combineReducers */ } from 'redux'
import { connect } from 'react-redux'

import { dynamicCombineReducers } from 'redux-plugin-dynamic-router-reducer' // instead of combineReducers
// required inport react router history
import { createHistory } from 'history'

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

const history = createHistory()

const store = createStore(dynamicCombineReducers({stateReducer, todoReducer},
  {
    dynamic: true,
    bindRule: [
      { key: 'todoReducer', pathname: 'bar' },
      { key: 'sumReducer', pathname: 'foo' }
    ],
    injectHistory: history
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
    return nextProps.state.sumReducer !== this.props.state.sumReducer
  }
  render() {
    return (
      <div>
        Page: Foo
        <div>
          <button onClick={ this.props.incretment }>{ this.props.state.sumReducer }</button>
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
