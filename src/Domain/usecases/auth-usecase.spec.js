const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

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

const makeLoadUserEmailOnRepoError = () => {
  class LoadUserEmailOnRepoSpy {
    async load () {
      throw new Error()
    }
  }

  return new LoadUserEmailOnRepoSpy()
}

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

const makeEncrypterError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }

  return new EncrypterSpy()
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

const makeTokenGeneratorError = () => {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

const makeUpdateAccessTokenRepo = () => {
  class UpdateAccessTokenRepoSpy {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  const updateAccessTokenRepoSpy = new UpdateAccessTokenRepoSpy()

  return updateAccessTokenRepoSpy
}

const makeUpdateAccessTokenRepoError = () => {
  class UpdateAccessTokenRepoSpy {
    async update () {
      throw new Error()
    }
  }

  return new UpdateAccessTokenRepoSpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserEmailOnRepoSpy = makeLoadUserEmailOnRepo()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepoSpy = makeUpdateAccessTokenRepo()
  const sut = new AuthUseCase({
    loadUserEmailOnRepo: loadUserEmailOnRepoSpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepo: updateAccessTokenRepoSpy
  })

  return {
    sut,
    loadUserEmailOnRepoSpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepoSpy
  }
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

  test('Should call UpdateAccessTokenRepo with correct values', async () => {
    const { sut, loadUserEmailOnRepoSpy, tokenGeneratorSpy, updateAccessTokenRepoSpy } = makeSut()
    await sut.auth('any@mail.com', 'dafadsfsdf')

    expect(updateAccessTokenRepoSpy.userId).toBe(loadUserEmailOnRepoSpy.user.id)
    expect(updateAccessTokenRepoSpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const loadUserEmailOnRepo = makeLoadUserEmailOnRepo()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const invalid = {}
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({
        loadUserEmailOnRepo: null,
        encrypter: null,
        tokenGenerator: null,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo: invalid,
        encrypter: null,
        tokenGenerator: null,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter: null,
        tokenGenerator: null,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter: invalid,
        tokenGenerator: null,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter,
        tokenGenerator: null,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter,
        tokenGenerator: invalid,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepo: invalid
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('mail.test@mail.com', 'dsdfs')

      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if dependency throws Error', async () => {
    const loadUserEmailOnRepo = makeLoadUserEmailOnRepo()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const suts = [].concat(
      new AuthUseCase({
        loadUserEmailOnRepo: makeLoadUserEmailOnRepoError(),
        encrypter: null,
        tokenGenerator: null,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter: makeEncrypterError(),
        tokenGenerator: null,
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter,
        tokenGenerator: makeTokenGeneratorError(),
        updateAccessTokenRepo: null
      }),
      new AuthUseCase({
        loadUserEmailOnRepo,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepo: makeUpdateAccessTokenRepoError()
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('mail.test@mail.com', 'dsdfs')

      expect(promise).rejects.toThrow()
    }
  })
})
