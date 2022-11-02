import { S } from 'S'
import { describe, test } from 'testing'

describe('batch', () => {
  test('batch runs correct vertical scopes', () => {
    const [value1, setValue1] = S.value(0)
    const [value2, setValue2] = S.value(0)
    const [value3, setValue3] = S.value(0)
    let count1 = 0
    let count2 = 0
    let count3 = 0

    S.root(() => {
      S(() => {
        value1()
        value2()
        value3()
        count1++
      })

      S(() => {
        value1()
        value2()
        value3()
        count2++
      })

      S(() => {
        value1()
        value2()
        value3()
        count3++
      })
    })


    const check1 = count1 === 1
    const check2 = count2 === 1
    const check3 = count3 === 1

    S.batch(() => {
      setValue1(1)
      setValue2(2)
      setValue3(3)
    })

    const check4 = count1 === 2
    const check5 = count2 === 2
    const check6 = count3 === 2

    S.batch(() => {
      setValue1(4)
      setValue2(5)
      setValue3(6)
    })

    const check7 = count1 === 3
    const check8 = count2 === 3
    const check9 = count3 === 3
    return check1 && check2 && check3 && check4 && check5 && check6 && check7 && check8 && check9
  })

  test('batch runs correct horizontal scopes', () => {
    const [value1, setValue1] = S.value(0)
    const [value2, setValue2] = S.value(0)
    const [value3, setValue3] = S.value(0)
    let count1 = 0
    let count2 = 0
    let count3 = 0

    S.root(() => {
      S(() => {
        value1()
        value2()
        value3()
        count1++

        S(() => {
          value1()
          value2()
          value3()
          count2++

          S(() => {
            value1()
            value2()
            value3()
            count3++
          })
        })
      })
    })

    const check1 = count1 === 1
    const check2 = count2 === 1
    const check3 = count3 === 1

    S.batch(() => {
      setValue1(1)
      setValue2(2)
      setValue3(3)
    })

    const check4 = count1 === 2
    const check5 = count2 === 2
    const check6 = count3 === 2

    S.batch(() => {
      setValue1(4)
      setValue2(5)
      setValue3(6)
    })

    const check7 = count1 === 3
    const check8 = count2 === 3
    const check9 = count3 === 3
    return check1 && check2 && check3 && check4 && check5 && check6 && check7 && check8 && check9
  })

  test('value in batch is updated', () => {
    const [value, setValue1] = S.value(0)
    let stale1
    let stale2

    S.batch(() => {
      stale1 = value()
      setValue1(1)
      stale2 = value()
    })

    const check1 = stale1 === 0
    const check2 = stale2 === 1
    return check1 && check2 && value() === 1
  })
})
