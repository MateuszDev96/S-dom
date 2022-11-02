import { S } from 'S'
import { describe, test } from 'testing'

describe('memo', () => {
  test('scope is runs once', () => {
    let count = 0

    S.root(() => {
      S(() => {
        S.memo(() => {
          count++
        })
      })
    })

    const check1 = count === 1
    return check1
  })

  test('scope returns getter', () => {
    let get = null

    S.root(() => {
      get = S.memo(() => 1)
    })

    const check1 = get() === 1
    return check1
  })

  test('returns computed value', () => {
    const [value, setValue] = S.value(0)
    let get = null

    S.root(() => {
      get = S.memo(() => value())
    })

    const check1 = get() === 0
    setValue(1)
    const check2 = get() === 1
    return check1 && check2
  })

  test('equals = true not run scope', () => {
    const [value, setValue] = S.value(0)
    let count = 0

    
    S.root(() => {
      const get = S.memo(() => value(), undefined, { equals: () => true })
      
      S(() => {
        count++
        get()
      })
    })

    const check1 = count === 1
    setValue(1)
    const check2 = count === 1
    setValue(2)
    const check3 = count === 1

    return check1 && check2 && check3
  })

  test('equals = false runs scope', () => {
    const [value, setValue] = S.value(0)
    let count = 0

    
    S.root(() => {
      const get = S.memo(() => value(), undefined, { equals: () => false })
      
      S(() => {
        count++
        get()
      })
    })

    const check1 = count === 1
    setValue(1)
    const check2 = count === 2
    setValue(2)
    return check1 && check2
  })

  test('equals has correct prev and next values', () => {
    const calls = []
    const [value, setValue] = S.value(0)

    S.root(() => {
      S.memo(() => value(), undefined, {
        equals: (prev, next) => {
          calls.push(prev, next)
          return prev === next
        },
      })
    })

    const check1 = JSON.stringify(calls) === JSON.stringify([undefined, 0])
    setValue(1)
    const check2 = JSON.stringify(calls) === JSON.stringify([undefined, 0, 0, 1])
    setValue(2)
    const check3 = JSON.stringify(calls) === JSON.stringify([undefined, 0, 0, 1, 1, 2])
    setValue(3)
    const check4 = JSON.stringify(calls) === JSON.stringify([undefined, 0, 0, 1, 1, 2, 2, 3])
    return check1 && check2 && check3 && check4
  })

  test('scope has a correct initial value', () => {
    let get = null

    S.root(() => {
      get = S.memo(() => 2, 1, { equals: () => true })
    })

    const check1 = get() === 1
    return check1
  })
})
