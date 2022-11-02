import { S } from 'S'
import { isFunction, isNullable } from './utils'

const toggleAttribute = (tag, key, value) => {
  if (key === 'value') {
    tag.value = isNullable(value) ? '' : value
  } else {
    isNullable(value) ? tag.removeAttribute(key) : tag.setAttribute(key, value)
  }
}

export const spreadProps = (tag, { ref, ...props }) => {
  if (isFunction(ref)) {
    ref(tag)
  }

  Object.entries(props).forEach(([key, value]) => {
    if (isFunction(value)) {
      S(() => toggleAttribute(tag, key, value()))
    } else {
      toggleAttribute(tag, key, value)
    }
  })
}