export const describe = (name, fn) => {
  console.log('%c ' + name + ' ', 'background: #3c79ff; color: #ffffff')
  fn()
}
