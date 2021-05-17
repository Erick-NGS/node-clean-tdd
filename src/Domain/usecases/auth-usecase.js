const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor ({ loadUserEmailOnRepo, encrypter, tokenGenerator } = {}) {
    this.loadUserEmailOnRepo = loadUserEmailOnRepo
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
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

    const user = await this.loadUserEmailOnRepo.load(email)
    const isValid = user && await this.encrypter.compare(password, user.password)
    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user.id)
      return accessToken
    }

    return null
  }
}
