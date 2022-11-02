import { S } from 'S'
import { describe, test } from 'testing'

describe('isTracking', () => {
  test('is not tracking outside root', () => {
    let result = null

    result = S.isTracking()

    const check1 = result === false
    return check1
  })

  test('is tracking in root scope', () => {
    let result = null

    S.root(() => {
      result = S.isTracking()
    })

    const check1 = result === true
    return check1
  })

  test('is tracking in scope', () => {
    let result = null

    S.root(() => {
      S(() => {
        result = S.isTracking()
      })
    })

    const check1 = result === true
    return check1
  })

  test('is tracking in untracked scope', () => {
    let result = null

    S.root(() => {
      S(() => {
        S.untrack(() => {
          result = S.isTracking()
        })
      })
    })

    const check1 = result === true
    return check1
  })
})