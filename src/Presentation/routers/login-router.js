const HttpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpReq) {
    try {
      const { email, password } = httpReq.body
      if (!email) {
        return HttpResponse.badRequest('email')
      }

      if (!password) {
        return HttpResponse.badRequest('password')
      }
      const accessToken = await this.authUseCase.auth(email, password)

      if (!accessToken) {
        return HttpResponse.unauthorized()
      }

      return HttpResponse.ok({ accessToken })
    } catch (error) {
      return HttpResponse.internalServerError()
    }
  }
}
