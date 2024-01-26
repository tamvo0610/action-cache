export const Log = {
  info: (str: string) => {
    console.log(`===== INFO: ${str}`)
    return `===== INFO: ${str}`
  },
  error: (str: string) => {
    console.log(`===== ERROR: ${str}`)
    return `===== ERROR: ${str}`
  }
}
