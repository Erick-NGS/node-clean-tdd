const InternalServerError = require('./internalServerError')
const InvalidParamError = require('./invalidParamError')
const MissingParamError = require('./missingParamError')
const UnauthorizedError = require('./unauthorizedError')

module.exports = {
  InternalServerError,
  InvalidParamError,
  MissingParamError,
  UnauthorizedError
}
