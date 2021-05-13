const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

describe('Auth UseCase', () => {
  test('Should throw if there\'s no email', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if there\'s no password', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('mail.test@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
