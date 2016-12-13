import { dynamicCombineReducers } from '../src'
import { shallow } from 'enzyme';
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import createHashHistory from 'react-router/lib/createMemoryHistory'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

function sumReducer(state = 0, action) {
  switch(action.type) {
    case 'INCREMENT':
    return state + 1
    default:
    return state
  }
}

describe('Utils', () => {
  describe('dynamicCombineReducers', () => {

    let node
    beforeEach(function () {
      node = document.createElement('div')
    })

    class Index extends Component {
      constructor(props, context) {
        super(props, context);
      }
      render() {
        return this.props.children
      }
    }

    class Bar extends Component {
      constructor(props, context) {
        super(props, context);
      }
      render() {
        return <div>{ this.props.state.sumReducer ? 'no store' : this.props.state.sumReducer }</div>
      }
    }
    const ConnectorBar = connect((state) => { return { state: state } })(Bar)

    class Foo extends Component {
      constructor(props, context) {
        super(props, context);
      }
      componentDidMount() {
        this.props.init()
      }
      render() {
        return <div>{ this.props.state.sumReducer }</div>
      }
    }
    const ConnectorFoo = connect((state) => { return { state: state } }, { init: () => { return { type: '@@INIT' } } })(Foo)


    const history = createHashHistory('/')

    const store = createStore(dynamicCombineReducers({
      sumReducer
    },
    {
      dynamic: true,
      bindRule: [
        { key: 'sumReducer', pathname: '/foo' }
      ],
      injectHistory: history
    }))

    it('return a composite reducer that maps the state keys to state', (done) => {
      render((
        <Provider store={ store }>
          <Router history={ history }>
            <Route path='/' component={ Index }>
              <Route path='bar' component={ ConnectorBar } />
              <Route path='foo' component={ ConnectorFoo } />
            </Route>
          </Router>
        </Provider>
      ), node)

      expect(store.getState()).toEqual({})

      history.push('/bar')

      expect(store.getState()).toEqual({})

      history.push('/foo')

      expect(store.getState()).toEqual({ sumReducer: 0 })

      store.dispatch({ type: 'INCREMENT' })

      expect(store.getState()).toEqual({ sumReducer: 1 })

      done()
    })
  })
})
