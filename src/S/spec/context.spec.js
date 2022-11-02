import { S } from 'S'
import { describe, test } from 'testing'

// suppressed warnings
window.console.warn = () => {}

describe('context', () => {
  test('`context.get` throws error if runs outside reactive scope', () => {
    let error

    try {
      S.context.get('key')
    } catch (e) {
      error = e.message
    }

    const check1 = error === 'Created outside reactive scope'
    return check1
  })

  test('`context.has` throws error if runs outside reactive scope', () => {
    let error

    try {
      S.context.has('key')
    } catch (e) {
      error = e.message
    }

    const check1 = error === 'Created outside reactive scope'
    return check1
  })

  test('`context.set` throws error if runs outside reactive scope', () => {
    let error

    try {
      S.context.set('key')
    } catch (e) {
      error = e.message
    }

    const check1 = error === 'Created outside reactive scope'
    return check1
  })

  test('`context.get` returns `null` for unset value', () => {
    let value

    S.root(() => {
      S(() => {
        value = S.context.get('key')
      })
    })

    const check1 = value === null
    return check1
  })

  test('`context.get` returns value', () => {
    let value

    S.root(() => {
      S(() => {
        S.context.set('key', 'value')
        value = S.context.get('key')
      })
    })

    const check1 = value === 'value'
    return check1
  })

  test('`context.get` returns value from nested', () => {
    let value

    S.root(() => {
      S(() => {
        S.context.set('key', 'value')

        S(() => {
          S(() => {
            value = S.context.get('key')
          })
        })
      })
    })


    const check1 = value === 'value'
    return check1
  })

  test('`context.get` parent cannot get value from child', () => {
    let value

    S.root(() => {
      S(() => {
        value = S.context.get('key')

        S(() => {
          S.context.set('key', 'value')
        })
      })
    })


    const check1 = value === null
    return check1
  })

  test('`context.set` can set multiple times', () => {
    let value1
    let value2
    let value3

    S.root(() => {
      S(() => {
        S.context.set('key1', 'value1')
        S.context.set('key2', 'value2')
        S.context.set('key3', 'value3')
        value1 = S.context.get('key1')
        value2 = S.context.get('key2')
        value3 = S.context.get('key3')
      })
    })


    const check1 = value1 === 'value1'
    const check2 = value2 === 'value2'
    const check3 = value3 === 'value3'
    return check1 && check2 && check3
  })

  test('`context.has` returns `false` if value does not exists', () => {
    let result

    S.root(() => {
      S(() => {
        result = S.context.has('key')
      })
    })

    const check1 = result === false
    return check1
  })

  test('`context.has` returns `true` if value does not exists', () => {
    let result

    S.root(() => {
      S(() => {
        S.context.set('key', 'value')
        result = S.context.has('key')
      })
    })

    const check1 = result === true
    return check1
  })

  test('`context.has` returns `false` from nested', () => {
    let result

    S.root(() => {
      S(() => {
        S(() => {
          S(() => {
            result = S.context.has('key')
          })
        })
      })
    })

    const check1 = result === false
    return check1
  })

  test('`context.has` returns `true` from nested', () => {
    let result

    S.root(() => {
      S(() => {
        S.context.set('key', 'value')

        S(() => {
          S(() => {
            result = S.context.has('key')
          })
        })
      })
    })

    const check1 = result === true
    return check1
  })
})
