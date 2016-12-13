// @flow
declare interface ReactRouterHistory {
  listenBefore: (hook: Function) => Function;
  listen: (listener: Function) => Function;
  transitionTo: (location: Object) => void;
  push: (location: Object) => void;
  replace: (location: Object) => void;
  go: (n: number) => void;
  goBack: () => void;
  goForward: () => void;
  createKey: () => string;
  createPath: (location: Object) => string;
  createHref: (location: Object) => string;
  createLocation: (location: Object, action?: string, key?: string) => string;
}

declare interface ReactRouterCombineOptionsRule {
  key: string;
  pathname: string;
}
declare interface ReactRouterCombineOptions {
  dynamic: boolean;
  bindRule: Array<ReactRouterCombineOptionsRule>;
  injectHistory: ReactRouterHistory;
}

declare interface ActionType {
  type: string
}

export const dynamicCombineReducers = (reducers: Object, options: ReactRouterCombineOptions): Function => {
  const reducerKeys: Array<string> = Object.keys(reducers)
  let finalReducers: Object = {}
  let finalReducerKeys: Array<string> = []

  const isDynamic: boolean = options && options.dynamic
  const bindRule: Array<Object> = options && options.bindRule
  let isConbineCache: Array<string> = []
  const injectHistory: ReactRouterHistory = options && options.injectHistory
  if (isDynamic) {
    const cacheReducer: Object = reducers
    const defaultReducer: Object = (state: Object = {}): Object => state
    bindRule.forEach((rule: ReactRouterCombineOptionsRule) => {
      if (!~isConbineCache.indexOf(rule.key)) {
        if (self.location.pathname === rule.pathname) {
          finalReducers[rule.key] = cacheReducer[rule.key]
          isConbineCache = isConbineCache.concat(rule.key)
        }
      }
    })
    injectHistory.listen((e) => {
      if (finalReducers['emptyReducer']) {
        delete finalReducers['emptyReducer']
      }
      bindRule.forEach((rule: ReactRouterCombineOptionsRule) => {
        if (!~isConbineCache.indexOf(rule.key)) {
          if (e.pathname === rule.pathname) {
            finalReducers[rule.key] = cacheReducer[rule.key]
            isConbineCache = isConbineCache.concat(rule.key)
            finalReducerKeys = Object.keys(finalReducers)
          }
        }
      })
    })
    if (Object.keys(finalReducers).length === 0) {
      finalReducers = Object.assign({}, { emptyReducer: defaultReducer})
    }
  }

  return (state = {}, action: ActionType): Object => {
    let hasChanged: boolean = false
    let nextState: Object = {}
    finalReducerKeys.forEach((reducerKey: string) => {
      const reducer: Function = finalReducers[reducerKey]
      const previousStateForKey: Object = state[reducerKey]
      const nextStateForKey: Object = reducer(previousStateForKey, action)
      nextState[reducerKey] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    })
    return hasChanged ? nextState : state
  }
}
