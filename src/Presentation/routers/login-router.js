const HttpResponse = require('../helpers/httpResponse')
const MissingParamError = require('../helpers/missingParamError')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpReq) {
    try {
      const { email, password } = httpReq.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      // if (!/email/.test(email)) {
      //   return HttpResponse.badRequest('email')
      // }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
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
