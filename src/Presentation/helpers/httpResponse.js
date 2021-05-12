const UnauthorizedError = require('./unauthorizedError')
const ServerError = require('./internalServerError')

module.exports =
  class HttpResponse {
    static badRequest (error) {
      return {
        statusCode: 400,
        body: error
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
