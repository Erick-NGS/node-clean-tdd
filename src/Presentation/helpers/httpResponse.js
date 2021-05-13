const { UnauthorizedError, InternalServerError } = require('../errors')

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
        body: new InternalServerError()
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
