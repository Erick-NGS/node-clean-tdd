const LoginRouter = require('./login-router')
const MissingParamErr = require('../helpers/missingParamError')
const UnauthorizedError = require('../helpers/unauthorizedError')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  /*
  Mocar o valor esperado na classe utilizada,
  para não haver necessidade de mocar em mais de uma chamada
  */
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
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpReq = {
      body: {
        email: 'invalid@test.com',
        password: 'invalid'
      }
    }

    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(401)
    expect(httpRes.body).toEqual(new UnauthorizedError())
  })

  test('Should return code 200 with valid credentials', () => {
    const { sut } = makeSut()
    const httpReq = {
      body: {
        email: 'valid@test.com',
        password: 'valid'
      }
    }

    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(200)
  })

  test('Should return 500 if there\'s no AuthUseCase is provided', () => {
    const sut = new LoginRouter()
    const httpReq = {
      body: {
        email: 'test@test.com',
        password: 'fasfasfsa'
      }
    }
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
  })

  test('Should return 500 if there\'s no AuthUseCase auth method', () => {
    class AuthUseCaseSpy { }
    const authUseCaseSpy = new AuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpReq = {
      body: {
        email: 'test@test.com',
        password: 'fasfasfsa'
      }
    }
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
  })
})

// sut = System Under Test
