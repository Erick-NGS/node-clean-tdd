const LoginRouter = require('./login-router')
const MissingParamErr = require('../helpers/missingParamError')
const UnauthorizedError = require('../helpers/unauthorizedError')
const ServerError = require('../helpers/internalServerError')

const makeSut = () => {
  const authUseCaseSpy = factoryAuthUseCase()
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

const factoryAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }
  return new AuthUseCaseSpy()
}

const helperAuthUseCaseError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }
  return new AuthUseCaseSpy()
}

describe('LoginRouter', () => {
  test('Should return 400 if there\'s no email', async () => {
    const { sut } = makeSut()
    const httpReq = {
      body: {
        password: 'sfasfwq'
      }
    }
    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamErr('email'))
  })

  test('Should return 400 if there\'s no password', async () => {
    const { sut } = makeSut()
    const httpReq = {
      body: {
        email: 'test@test.com'
      }
    }
    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new MissingParamErr('password'))
  })

  test('Should return 500 if there\'s no httpRequest', async () => {
    const { sut } = makeSut()

    const httpRes = await sut.route()

    expect(httpRes.statusCode).toBe(500)
    expect(httpRes.body).toEqual(new ServerError())
  })

  test('Should return 500 if there\'s no httpRequest body', async () => {
    const { sut } = makeSut()
    const httpReq = {}
    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
    expect(httpRes.body).toEqual(new ServerError())
  })

  test('Should call AuthUseCase with the correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpReq = {
      body: {
        email: 'test@test.com',
        password: 'fasfasfsa'
      }
    }

    await sut.route(httpReq)

    expect(authUseCaseSpy.email).toBe(httpReq.body.email)
    expect(authUseCaseSpy.password).toBe(httpReq.body.password)
  })

  test('Should return 401 with invalid credentials', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpReq = {
      body: {
        email: 'invalid@test.com',
        password: 'invalid'
      }
    }

    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(401)
    expect(httpRes.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 with valid credentials', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpReq = {
      body: {
        email: 'valid@test.com',
        password: 'valid'
      }
    }

    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(200)
    expect(httpRes.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should return 500 if there\'s no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpReq = {
      body: {
        email: 'test@test.com',
        password: 'fasfasfsa'
      }
    }
    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
    expect(httpRes.body).toEqual(new ServerError())
  })

  test('Should return 500 if there\'s no AuthUseCase auth method', async () => {
    class AuthUseCaseSpy { }
    const authUseCaseSpy = new AuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpReq = {
      body: {
        email: 'test@test.com',
        password: 'fasfasfsa'
      }
    }
    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
    expect(httpRes.body).toEqual(new ServerError())
  })

  test('Should return 500 if AuthUseCase throws', async () => {
    const authUseCaseSpy = helperAuthUseCaseError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpReq = {
      body: {
        email: 'test@test.com',
        password: 'fasfasfsa'
      }
    }
    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
  })
})

// sut = System Under Test
