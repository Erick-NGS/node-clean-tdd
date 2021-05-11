const HttpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpReq) {
    if (!httpReq || !httpReq.body) {
      return HttpResponse.internalServerError()
    }
    const { email, password } = httpReq.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }

    if (!password) {
      return HttpResponse.badRequest('password')
    }
    this.authUseCase.auth(email, password)
    return {
      statusCode: 401
    }
  }
}