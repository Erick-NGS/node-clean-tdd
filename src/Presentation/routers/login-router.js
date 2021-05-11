const HttpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpReq) {
    if (!httpReq || !httpReq.body || !this.authUseCase || !this.authUseCase.auth) {
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

    return HttpResponse.unauthorized()
  }
}
