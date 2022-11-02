import { S } from 'S'
import { isObject, isFunction, isString } from './utils'
import { spreadProps } from './spreadProps'
import { spreadChildren } from './spreadChildren'

export const h = (type, props, ...children) => () => {
  if (isString(type)) {
    const tag = document.createElement(type)
    spreadProps(tag, { ...props })
    tag.append(...spreadChildren(children))
    return tag
  } else if (isFunction(type)) {
    return S.untrack(() => type({ ...props, children }))
  } else if (isObject(type)) {
    return type.children
  }
}