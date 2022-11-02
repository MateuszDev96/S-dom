export const isObject = (value) => Object.prototype.toString.call(value) === '[object Object]'
export const isNullable = (value) => value === null || value === undefined
export const isNodeInstance = (value) => value instanceof Node
export const isFunction = (value) => typeof value === 'function'
export const isString = (value) => typeof value === 'string'
export const isArray = (value) => Array.isArray(value)

export const insertChildAtIndex = (parent, child, index) => {
  const fragment = document.createDocumentFragment()
  fragment.append(...child)

  if (index >= parent.children.length) {
    parent.appendChild(fragment)
  } else {
    parent.insertBefore(fragment, parent.children[index])
  }
}
