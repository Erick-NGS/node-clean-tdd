const HttpResponse = require('../helpers/httpResponse')

module.exports = class LoginRouter {
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
  }
}
