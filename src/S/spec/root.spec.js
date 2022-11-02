import { S } from 'S'
import { describe, test } from 'testing'

describe('root', () => {
  test('scope is runs once', () => {
    let count = 0

    S.root(() => {
      count++
    })

    const check1 = count === 1
    return check1
  })

  test('scope is not reactive', () => {
    let count = 0
    const [value, setValue] = S.value(0)

    S.root(() => {
      count++
      value()
    })

    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = count === 1
    return check1
  })

  test('allow to unsubscribe', () => {
    const [value, setValue] = S.value(0)
    let count = 0

    const unsubscribe = S.root(() => {
      S(() => {
        count++
        value()
      })
    })

    setValue(1)
    unsubscribe()
    setValue(2)
    setValue(3)

    const check1 = count === 2
    return check1
  })

  test('allow to runaway', () => {
    const [value, setValue] = S.value(0)
    let count = 0
    
    const unsubscribe = S.root(() => {
      S.root(() => {
        S(() => {
          count++
          value()
        })
      })
    })

    setValue(1)
    unsubscribe()
    setValue(2)
    setValue(3)

    const check1 = count === 4
    return check1
  })
})