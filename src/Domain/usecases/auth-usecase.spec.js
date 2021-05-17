const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeLoadUserEmailOnRepo = () => {
  class LoadUserEmailOnRepoSpy {
    async load (email) {
      this.email = email

      return this.user
    }
  }

  const loadUserEmailOnRepo = new LoadUserEmailOnRepoSpy()
  loadUserEmailOnRepo.user = { password: 'hashed', id: 'userId' }

  return loadUserEmailOnRepo
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId

      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'token'

  return tokenGeneratorSpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserEmailOnRepoSpy = makeLoadUserEmailOnRepo()
  const tokenGeneratorSpy = makeTokenGenerator()
  const sut = new AuthUseCase({
    loadUserEmailOnRepo: loadUserEmailOnRepoSpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return { sut, loadUserEmailOnRepoSpy, encrypterSpy, tokenGeneratorSpy }
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

  test('Should throw if no dependency is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('mail.test@mail.com', 'dsdfs')

    expect(promise).rejects.toThrow(new MissingParamError('loadUserEmailOnRepo'))
  })

  test('Should throw if no repo is provided', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('mail.test@mail.com', 'dsdfs')

    expect(promise).rejects.toThrow(new MissingParamError('loadUserEmailOnRepo'))
  })

  test('Should throw if repo has no load method', async () => {
    const sut = new AuthUseCase({ loadUserEmailOnRepo: {} })
    const promise = sut.auth('mail.test@mail.com', 'dsdfs')

    expect(promise).rejects.toThrow(new InvalidParamError('loadUserEmailOnRepo'))
  })

  test('Should return null if the repo returns an invalid email', async () => {
    const { sut, loadUserEmailOnRepoSpy } = makeSut()
    loadUserEmailOnRepoSpy.user = null
    const accessToken = await sut.auth('any@mail.com', 'dsdfs')

    expect(accessToken).toBeNull()
  })

  test('Should return null if the repo returns an invalid password', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('any@mail.com', 'bad_pass')

    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserEmailOnRepoSpy, encrypterSpy } = makeSut()
    await sut.auth('any@mail.com', 'dafadsfsdf')

    expect(encrypterSpy.password).toBe('dafadsfsdf')
    expect(encrypterSpy.hashedPassword).toBe(loadUserEmailOnRepoSpy.user.password)
  })

  test('Should call TokenGenerator with correct values', async () => {
    const { sut, loadUserEmailOnRepoSpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('any@mail.com', 'dafadsfsdf')

    expect(tokenGeneratorSpy.userId).toBe(loadUserEmailOnRepoSpy.user.id)
  })

  test('Should return an access token with right credentials', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('any@mail.com', 'dafadsfsdf')

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
