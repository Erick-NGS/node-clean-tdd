const { MissingParamError, InvalidParamError } = require('../../utils/errors')

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

    if (!this.loadUserEmailOnRepo) {
      throw new MissingParamError('loadUserEmailOnRepo')
    }

    if (!this.loadUserEmailOnRepo.load) {
      throw new InvalidParamError('loadUserEmailOnRepo')
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

  test('Should throw if no repo is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('mail.test@mail.com', 'dsdfs')

    expect(promise).rejects.toThrow(new MissingParamError('loadUserEmailOnRepo'))
  })

  test('Should throw if repo has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('mail.test@mail.com', 'dsdfs')

    expect(promise).rejects.toThrow(new InvalidParamError('loadUserEmailOnRepo'))
  })
})
