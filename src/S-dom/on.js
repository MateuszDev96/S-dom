import { S } from 'S'

export const on = (node, type, fn, options) => {
  node.addEventListener(type, fn, options)
  S.onCleanup(() => node.removeEventListener(type, fn, options))
}