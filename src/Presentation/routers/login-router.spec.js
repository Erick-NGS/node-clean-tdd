class LoginRouter {
  route (httpReq) {
    if (!httpReq || !httpReq.body) {
      return {
        statusCode: 500
      }
    }
    const { email, password } = httpReq.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('LoginRouter', () => {
  test('Should return 400 if there\'s no email', () => {
    const sut = new LoginRouter()
    const httpReq = {
      body: {
        password: 'sfasfwq'
      }
    }
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(400)
  })

  test('Should return 400 if there\'s no password', () => {
    const sut = new LoginRouter()
    const httpReq = {
      body: {
        email: 'test@test.com'
      }
    }
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(400)
  })

  test('Should return 500 if there\'s no httpRequest', () => {
    const sut = new LoginRouter()

    const httpRes = sut.route()

    expect(httpRes.statusCode).toBe(500)
  })

  test('Should return 500 if there\'s no httpRequest body', () => {
    const sut = new LoginRouter()
    const httpReq = {}
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
  })
})

// sut = System Under Test
