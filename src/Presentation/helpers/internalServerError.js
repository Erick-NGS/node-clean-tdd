module.exports = class ServerError extends Error {
  constructor () {
    super('Internal Server Error! Try again in a bit!')
    this.name = 'ServerError'
  }
}
