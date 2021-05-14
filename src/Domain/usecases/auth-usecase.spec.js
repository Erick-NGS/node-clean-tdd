const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserEmailOnRepo) {
    this.loadUserEmailOnRepo = loadUserEmailOnRepo
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!password) {
      throw new MissingParamError('password')
    }
    await this.loadUserEmailOnRepo.load(email)
  }
}

const makeSut = () => {
  class LoadUserEmailOnRepoSpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserEmailOnRepoSpy = new LoadUserEmailOnRepoSpy()
  const sut = new AuthUseCase(loadUserEmailOnRepoSpy)

  return { sut, loadUserEmailOnRepoSpy }
}

describe('Auth UseCase', () => {
  test('Should throw if there\'s no email', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if there\'s no password', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('mail.test@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserEmailOnRepo with correct email', async () => {
    const { sut, loadUserEmailOnRepoSpy } = makeSut()
    await sut.auth('mail.test@mail.com', 'dsdfs')

    expect(loadUserEmailOnRepoSpy.email).toBe('mail.test@mail.com')
  })
})
