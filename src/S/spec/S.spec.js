import { S } from 'S'
import { describe, test } from 'testing'

describe('S', () => {
  test('throws error if runs outside reactive scope', () => {
    let error

    try {
      S(() => {})
    } catch (e) {
      error = e.message
    }

    const check1 = error === 'Created outside reactive scope'
    return check1
  })

  test('scope is runs once', () => {
    let count = 0

    S.root(() => {
      S(() => {
        count++
      })
    })

    const check1 = count === 1
    return check1
  })

  test('scope is reactive', () => {
    let count = 0
    const [value, setValue] = S.value(0)

    S.root(() => {
      S(() => {
        count++
        value()
      })
    })

    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = count === 4
    return check1
  })

  test('correct runs vertical scopes', () => {
    let count1 = 0
    let count2 = 0
    let count3 = 0
    let calls = []
    const [value, setValue] = S.value(0)

    S.root(() => {
      S(() => {
        count1++
        calls.push(1)
        value()
      })

      S(() => {
        count2++
        calls.push(2)
        value()
      })

      S(() => {
        count3++
        calls.push(3)
        value()
      })
    })

    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = [count1, count2, count3].every((v) => v === 4)
    const check2 = JSON.stringify(calls) === JSON.stringify([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3])
    return check1 && check2
  })

  test('correct runs horizontal scopes', () => {
    let count1 = 0
    let count2 = 0
    let count3 = 0
    let calls = []
    const [value, setValue] = S.value(0)

    S.root(() => {
      S(() => {
        count1++
        calls.push(1)
        value()
  
        S(() => {
          count2++
          calls.push(2)
          value()
  
          S(() => {
            count3++
            calls.push(3)
            value()
          })
        })
      })
    })

    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = [count1, count2, count3].every((v) => v === 4)
    const check2 = JSON.stringify(calls) === JSON.stringify([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3])
    return check1 && check2
  })

  test('correct runs horizontal scopes from top lvl', () => {
    let count1 = 0
    let count2 = 0
    let count3 = 0
    let calls = []
    const [value, setValue] = S.value(0)

    S.root(() => {
      S(() => {
        count1++
        calls.push(1)
        value()

        S(() => {
          count2++
          calls.push(2)

          S(() => {
            count3++
            calls.push(3)
          })
        })
      })
    })

    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = [count1, count2, count3].every((v) => v === 4)
    const check2 = JSON.stringify(calls) === JSON.stringify([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3])
    return check1 && check2
  })

  test('correct runs under condition', () => {
    const [show, setShow] = S.value(true)
    const [value, setValue] = S.value(0)
    let count = 0

    S.root(() => {
      S(() => {
        if (show()) {
          S(() => {
            count++
            value()
          })
        }
      })
    })

    setValue(1)
    const check1 = count === 2
    setValue(2)
    const check2 = count === 3
    setShow(false)
    setValue(3)
    const check3 = count === 3
    setShow(true)
    const check4 = count === 4
    setValue(4)
    const check5 = count === 5
    return check1 && check2 && check3 && check4 && check5
  })

  test('runs after finish scope', () => {
    const runs = []
    const [value, setValue] = S.value(0)

    S.root(() => {
      S(() => {
        value()
        runs.push(1)

        S(() => {
          runs.push(3)
        })

        runs.push(2)
      })
    })
    

    const check1 = JSON.stringify(runs) === JSON.stringify([1, 2, 3])
    setValue(1)
    const check2 = JSON.stringify(runs) === JSON.stringify([1, 2, 3, 1, 2, 3])
    return check1 && check2
  })
})
