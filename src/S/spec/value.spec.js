import { S } from 'S'
import { describe, test } from 'testing'

describe('signal', () => {
  test('returns initial value', () => {
    const [value] = S.value(0)

    const check1 = value() === 0
    return check1
  })

  test('returns `undefined` is value is not defined', () => {
    const [value] = S.value()

    const check1 = value() === undefined
    return check1
  })

  test('correct set value', () => {
    const [value, setValue] = S.value(0)

    setValue(1)

    const check1 = value() === 1
    return check1
  })

  test('correct set multi time value', () => {
    const [value, setValue] = S.value(0)

    setValue(1)
    setValue(2)
    setValue(3)

    const check1 = value() === 3
    return check1
  })

  test('value can be a function', () => {
    const [value, setValue] = S.value(null)

    setValue(() => 1)

    const check1 = value()() === 1
    return check1
  })

  test('scope is not run is value is the same', () => {
    const [value, setValue] = S.value(0)
    let count = 0

    S.root(() => {
      S(() => {
        value()
        count++
      })
    })

    const check1 = count === 1
    setValue(0)
    const check2 = count === 1
    return check1 && check2
  })

  test('equals = true not run scope', () => {
    const [value, setValue] = S.value(0, { equals: () => true })
    let count = 0

    S.root(() => {
      S(() => {
        value()
        count++
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
    const [value, setValue] = S.value(0, { equals: () => false })
    let count = 0

    S.root(() => {
      S(() => {
        value()
        count++
      })
    })

    const check1 = count === 1
    setValue(0)
    const check2 = count === 2
    setValue(1)
    return check1 && check2
  })

  test('equals has correct prev and next values', () => {
    const calls = []
    const [, setValue] = S.value(0, {
      equals: (prev, next) => {
        calls.push(prev, next)
        return prev === next
      },
    })

    setValue(1)
    const check1 = JSON.stringify(calls) === JSON.stringify([0, 1])
    setValue(2)
    const check2 = JSON.stringify(calls) === JSON.stringify([0, 1, 1, 2])
    setValue(3)
    const check3 = JSON.stringify(calls) === JSON.stringify([0, 1, 1, 2, 2, 3])
    return check1 && check2 && check3
  })
})
