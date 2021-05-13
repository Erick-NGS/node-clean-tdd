module.exports = class MissingParamErr extends Error {
  constructor (paramName) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamErr'
  }
}
