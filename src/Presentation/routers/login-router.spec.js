class LoginRouter {
  route (httpReq) {
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
})

describe('LoginRouter', () => {
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
})

// sut = System Under Test
