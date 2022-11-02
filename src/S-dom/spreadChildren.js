import { isObject, isNullable, isFunction, isArray, isNodeInstance } from './utils'

export const spreadChildren = (...children) => {
  return children.map((child) => {
    if (isFunction(child)) {
      return spreadChildren(...children.map((child) => child()))
    }

    if (isArray(child)) {
      return child.map((subchild) => spreadChildren(subchild))
    }

    if (isNullable(child)) {
      return child
    }

    if (!isNodeInstance(child)) {
      if (isObject(child)) {
        child = document.createTextNode(JSON.stringify(child))
      } else {
        child = document.createTextNode(child)
      }
    }

    return child
  }).flat(Infinity).filter((child) => !isNullable(child))
}