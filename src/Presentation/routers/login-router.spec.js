class LoginRouter {
  route (httpReq) {
    if (!httpReq.body.email) {
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

// sut = System Under Test
