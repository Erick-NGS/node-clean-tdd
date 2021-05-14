const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

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

  test('Should return null if the repo returns null as well', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('sdgs@mail.com', 'dsdfs')

    expect(accessToken).toBe(null)
  })
})
