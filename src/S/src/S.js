let currentScope = null
let batchQueue = null

const isRunInCurrentScope = () => {
  if (!currentScope) {
    throw new Error('Created outside reactive scope')
  }
}

const forEach = (value, fn) => {
  for (const entry of value) {
    fn(entry)
  }
}

const runWithOwner = (value, fn) => {
  const prevCurrentScope = currentScope
  currentScope = value
  const result = fn()
  currentScope = prevCurrentScope
  return result
}

const unsubscribeScope = (scope) => {
  forEach(scope.children, (child) => unsubscribeScope(child))
  forEach(scope.observables, (observable) => {
    observable.observers.delete(scope)
    observable.reconcilations.delete(scope)
  })
  forEach(scope.cleanups, (cleanup) => cleanup())
  scope.children.clear()
  scope.observables.clear()
  scope.cleanups.clear()
  scope.contexts.clear()
}

export const S = (fn) => {
  isRunInCurrentScope()

  const scope = () => {
    unsubscribeScope(scope)
    runWithOwner(scope, () => fn())
    forEach(scope.children, (child) => child())
  }

  scope.parentOwner = currentScope
  scope.preventTracking = false
  scope.children = new Set()
  scope.observables = new Set()
  scope.cleanups = new Set()
  scope.contexts = new Map()
  currentScope.children.add(scope)
}

S.root = (fn) => {
  const rootScope = () => {}
  rootScope.parentOwner = null
  rootScope.preventTracking = false
  rootScope.children = new Set()
  rootScope.observables = new Set()
  rootScope.cleanups = new Set()
  rootScope.contexts = new Map()

  runWithOwner(rootScope, () => {
    fn()
    forEach(rootScope.children, (child) => child())
  })
  
  return () => unsubscribeScope(rootScope)
}

S.value = (value = undefined, options = {}) => {
  if (!Reflect.has(options, 'equals')) {
    options.equals = (prev, next) => Object.is(prev, next)
  }

  const signal = () => {}
  signal.observers = new Set()
  signal.reconcilations = new Set()
  signal.reconcile = () => {
    signal.reconcilations = new Set(signal.observers)
    forEach(signal.reconcilations, (observer) => observer())
  }

  const get = () => {
    if (currentScope !== null && !currentScope.preventTracking) {
      signal.observers.add(currentScope)
      currentScope.observables.add(signal)
    }

    return value
  }

  const set = (nextValue) => {
    if (typeof options.equals === 'function' && options.equals(value, nextValue)) {
      return
    }

    value = nextValue
    batchQueue !== null ? batchQueue.add(signal) : signal.reconcile()
  }

  return [get, set]
}

S.subscriber = (fn) => {
  const cleanups = new Map()
  const subscribe = (id, ...value) => {
    if (!cleanups.has(id)) {
      cleanups.set(id, S.root(() => fn(id, ...value)))
    }
  }

  const unsubscribe = (id) => {
    if (cleanups.has(id)) {
      cleanups.get(id)()
      cleanups.delete(id)
    }
  }

  const unsubscribeAll = () => {
    cleanups.forEach((cleanup) => cleanup())
    cleanups.clear()
  }
  
  return {
    subscribe,
    unsubscribe,
    unsubscribeAll,
  }
}

S.memo = (fn, initial, options = {}) => {
  isRunInCurrentScope()
  const [value, setValue] = S.value(initial, options)
  S(() => setValue(fn()))
  return value
}

S.onCleanup = (fn) => {
  isRunInCurrentScope()
  currentScope.cleanups = new Set([fn, ...currentScope.cleanups])
}

S.batch = (fn) => {
  const signals = new Set()
  const observers = new Map()
  const prevBatchQueue = batchQueue
  batchQueue = signals
  fn()
  batchQueue = prevBatchQueue
  forEach(signals, (signal) => {
    forEach(signal.observers, (observer) => observers.set(observer, signal))
  })
  forEach(new Set([...observers.values()]), (signal) => signal.reconcile())
}

S.untrack = (fn) => {
  if (currentScope !== null) {
    const prevCurrentScope = currentScope
    currentScope.preventTracking = true
    const value = fn()
    currentScope.preventTracking = false
    currentScope = prevCurrentScope
    return value
  }

  return fn()
}

S.context = (() => {
  const findContext = (key) => {
    const result = {
      hasResult: false,
      value: null,
    }

    const find = (key, scope) => {
      if (scope === null) {
        return
      }

      const hasResult = scope.contexts.has(key)

      if (hasResult) {
        result.hasResult = hasResult
        result.value = scope.contexts.get(key)
      } else {
        find(key, scope.parentOwner)
      }
    }

    find(key, currentScope)
    return result
  }

  return {
    get: (key) => {
      isRunInCurrentScope()
      const { hasResult, value } = findContext(key)

      if (!hasResult) {
        console.warn('Cannot find context by key:', key)
      }

      return value
    },
    has: (key) => {
      isRunInCurrentScope()
      return findContext(key).hasResult
    },
    set: (key, value) => {
      isRunInCurrentScope()
      currentScope.contexts.set(key, value)
    },
  }
})()

S.isTracking = () => Boolean(currentScope)