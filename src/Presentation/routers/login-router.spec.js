const LoginRouter = require('./login-router')
const MissingParamErr = require('../helpers/missingParamError')

const makeSut = () => {
  return new LoginRouter()
}

describe('LoginRouter', () => {
  test('Should return 400 if there\'s no email', () => {
    const sut = makeSut()
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
    const sut = makeSut()
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
    const sut = makeSut()

    const httpRes = sut.route()

    expect(httpRes.statusCode).toBe(500)
  })

  test('Should return 500 if there\'s no httpRequest body', () => {
    const sut = makeSut()
    const httpReq = {}
    const httpRes = sut.route(httpReq)

    expect(httpRes.statusCode).toBe(500)
  })

  // test('Should call AuthUseCase with the correct params', () => {
  //   const sut = makeSut()
  //   const httpReq = {}
  //   const httpRes = sut.route(httpReq)

  //   expect(httpRes.statusCode).toBe(500)
  // })
})

// sut = System Under Test
