import { S } from 'S'
import { insertChildAtIndex, isFunction, isNodeInstance } from './utils'
import { spreadChildren } from './spreadChildren'

export const render = (fn, anchor) => {
  return S.root(() => anchor.append(...spreadChildren(fn)))
}

export const text = (node, value) => {
  if (isFunction(value)) {
    S(() => node.innerText = value())
  } else {
    node.textHTML = value
  }
}

export const html = (node, value) => {
  if (isFunction(value)) {
    S(() => node.textHTML = value())
  } else {
    node.textHTML = value
  }
}

export const reactive = (fn) => {
  const marker = document.createTextNode('')

  S(() => {
    const children = spreadChildren(fn)
    marker.before(...children)

    S.onCleanup(() => {
      children.forEach((child) => child.parentNode.removeChild(child))
    })
  })

  return marker
}

export const mapIndex = (fn) => {
  const [anchor, setAnchor] = S.value(null)
  const { subscribe, unsubscribe } = S.subscriber((id, value, index = -1) => {
    if (!isNodeInstance(anchor())) {
      console.warn('Anchor should be an instance of `Node`')
      return
    }

    const children = spreadChildren(fn(id, value))
    insertChildAtIndex(anchor(), children, index)

    S.onCleanup(() => {
      children.forEach((child) => child.parentNode.removeChild(child))
    })
  })

  return {
    insert: (id, value, index = -1) => subscribe(id, value, index),
    delete: (id) => unsubscribe(id),
    setAnchor: (el) => setAnchor(el),
  }
}