const MissingParamErr = require('./missingParamError')

module.exports =
  class HttpResponse {
    static badRequest (paramName) {
      return {
        statusCode: 400,
        body: new MissingParamErr(paramName)
      }
    }

    static internalServerError () {
      return {
        statusCode: 500
      }
    }
  }
