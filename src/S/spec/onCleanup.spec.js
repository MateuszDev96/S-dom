import { S } from 'S'
import { describe, test } from 'testing'

describe('onCleanup', () => {
  test('throws error if runs outside reactive scope', () => {
    let error

    try {
      S.onCleanup(() => {})
    } catch (e) {
      error = e.message
    }

    const check1 = error === 'Created outside reactive scope'
    return check1
  })

  test('runs in root lvl after unsubscribe', () => {
    let count = 0

    const unsubscribe = S.root(() => {
      S.onCleanup(() => {
        count++
      })
    })

    const check1 = count === 0
    unsubscribe()
    const check2 = count === 1
    return check1 && check2
  })

  test('runs in scope after unsubscribe', () => {
    let count = 0

    const unsubscribe = S.root(() => {
      S(() => {
        S.onCleanup(() => {
          count++
        })
      })
    })

    const check1 = count === 0
    unsubscribe()
    const check2 = count === 1
    return check1 && check2
  })

  test('runs before scope reconciliation', () => {
    const [value, setValue] = S.value(0)
    const calls = []

    S.root(() => {
      S(() => {
        value()
        calls.push(1)

        S.onCleanup(() => calls.push(2))
      })
    })

    const check1 = JSON.stringify(calls) === JSON.stringify([1])
    setValue(1)
    const check2 = JSON.stringify(calls) === JSON.stringify([1, 2, 1])
    setValue(2)
    const check3 = JSON.stringify(calls) === JSON.stringify([1, 2, 1, 2, 1])
    setValue(3)
    const check4 = JSON.stringify(calls) === JSON.stringify([1, 2, 1, 2, 1, 2, 1])

    return check1 && check2 && check3 && check4
  })

  test('correct runs under condition', () => {
    const [show, setShow] = S.value(true)
    let count = 0

    S.root(() => {
      S(() => {
        if (show()) {
          S.onCleanup(() => count++)
        }
      })
    })


    const check1 = count === 0
    setShow(false)
    const check2 = count === 1
    setShow(false)
    const check3 = count === 1
    setShow(true)
    const check4 = count === 1
    setShow(false)
    const check5 = count === 2
    return check1 && check2 && check3 && check4 && check5
  })

  test('runs multiple times', () => {
    const [value, setValue] = S.value(0)
    const calls = []

    S.root(() => {
      S(() => {
        value()
        S.onCleanup(() => calls.push(1))
        S.onCleanup(() => calls.push(2))
        S.onCleanup(() => calls.push(3))
      })
    })

    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = JSON.stringify(calls) === JSON.stringify([3, 2, 1, 3, 2, 1, 3, 2, 1])
    return check1
  })

  test('runs from child to parent', () => {
    const [value, setValue] = S.value(0)
    const calls = []

    S.root(() => {
      S(() => {
        value()

        S(() => {
          S.onCleanup(() => calls.push(1))

          S(() => {
            S.onCleanup(() => calls.push(2))

            S(() => {
              S.onCleanup(() => calls.push(3))
            })
          })
        })
      })
    })


    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = JSON.stringify(calls) === JSON.stringify([3, 2, 1, 3, 2, 1, 3, 2, 1])
    return check1
  })
})
