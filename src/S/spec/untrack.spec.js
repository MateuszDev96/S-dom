import { S } from 'S'
import { describe, test } from 'testing'

describe('untrack', () => {
  test('allow run without root', () => {
    const check1 = S.untrack(() => 0)

    return check1 === 0
  })

  test('is not reactive', () => {
    const [value, setValue] = S.value(0)
    let count = 0

    S.root(() => {
      S(() => {
        S.untrack(() => {
          count++
          value()
        })
      })
    })

    const check1 = count === 1
    setValue(1)
    const check2 = count === 1
    setValue(1)
    const check3 = count === 1
    return check1 && check2 && check3
  })

  test('returns value from untracked scope', () => {
    let value

    S.root(() => {
      S(() => {
        value = S.untrack(() => 1)
      })
    })

    const check1 = value === 1
    return check1
  })
})
