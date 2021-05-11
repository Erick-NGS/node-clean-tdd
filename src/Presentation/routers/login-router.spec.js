const LoginRouter = require('./login-router')
const MissingParamErr = require('../helpers/missingParamError')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    sut,
    authUseCaseSpy
  }
}

describe('LoginRouter', () => {
  test('Should return 400 if there\'s no email', () => {
    const { sut } = makeSut()
    const httpReq = {
      body: {
        password: 'sfasfwq'
      }
    }
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamErr('email'))
  })

  test('Should return 400 if there\'s no password', () => {
    const { sut } = makeSut()
    const httpReq = {
      body: {
        email: 'test@test.com'
      }
    }
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamErr('password'))
  })

  test('Should return 500 if there\'s no httpRequest', () => {
    const { sut } = makeSut()

    const httpRes = sut.route()

    expect(httpRes.statusCode).toBe(500)
  })

  test('Should return 500 if there\'s no httpRequest body', () => {
    const { sut } = makeSut()
    const httpReq = {}
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
  })

  test('Should call AuthUseCase with the correct params', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpReq = {
      body: {
        email: 'test@test.com',
        password: 'fasfasfsa'
      }
    }

    sut.route(httpReq)

    expect(authUseCaseSpy.email).toBe(httpReq.body.email)
    expect(authUseCaseSpy.password).toBe(httpReq.body.password)
  })

  test('Should return error code 401 with invalid credentials', () => {
    const { sut } = makeSut()
    const httpReq = {
      body: {
        email: 'invalid@test.com',
        password: 'invalid'
      }
    }

    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(401)
  })
})

// sut = System Under Test
