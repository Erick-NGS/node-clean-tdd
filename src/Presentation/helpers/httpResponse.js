const MissingParamError = require('./missingParamError')
const UnauthorizedError = require('./unauthorizedError')
const ServerError = require('./internalServerError')

module.exports =
  class HttpResponse {
    static badRequest (paramName) {
      return {
        statusCode: 400,
        body: new MissingParamError(paramName)
      }
    }

    static internalServerError () {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }

    static unauthorized () {
      return {
        statusCode: 401,
        body: new UnauthorizedError()
      }
    }

    static ok (token) {
      return {
        statusCode: 200,
        body: token
      }
    }
  }
