export const test = (name, fn) => {
  const value = fn()

  if (value) {
    console.log(`%c ${name} `, 'background: #3dc466; color: #ffffff; margin-left: 8px;')
  } else {
    console.log(`%c ${name} `, 'background: #ff0000; color: #ffffff; margin-left: 8px;')
  }
}
