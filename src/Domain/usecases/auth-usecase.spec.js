const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
  }
}

describe('Auth UseCase', () => {
  test('Should throw if there\'s no email', async () => {
    const sut = new AuthUseCase()
    const accessTokenPromise = sut.auth()

    expect(accessTokenPromise).rejects.toThrow(new MissingParamError('email'))
  })
})
