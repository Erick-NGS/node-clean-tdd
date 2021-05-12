const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missingParamError')
const InvalidParamError = require('../helpers/invalidParamError')
const UnauthorizedError = require('../helpers/unauthorizedError')
const ServerError = require('../helpers/internalServerError')

const makeSut = () => {
  const authUseCaseSpy = factoryAuthUseCase()
  const emailValidatorSpy = factoryEmailValidator()

  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
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
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  /*
  Mocar o valor esperado na classe utilizada,
  para não haver necessidade de mocar em mais de uma chamada
  */
  return authUseCaseSpy
}

const factoryEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
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
    expect(httpRes.body).toEqual(new MissingParamError('email'))
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
    expect(httpRes.body).toEqual(new MissingParamError('password'))
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

  test('Should return 400 if there\'s an invalid email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpReq = {
      body: {
        email: 'wrong_email.com',
        password: 'sfasfwq'
      }
    }
    const httpRes = await sut.route(httpReq)

    expect(httpRes.statusCode).toBe(400)
    expect(httpRes.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 500 if no EmmailValidator is provided', async () => {
    const authUseCaseSpy = factoryAuthUseCase()
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

  test('Should return 500 if there\'s no EmailValidator isValid method', async () => {
    const authUseCaseSpy = factoryAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})
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
})

// sut = System Under Test
