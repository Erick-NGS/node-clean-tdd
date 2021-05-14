const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserEmailOnRepo, encrypter) {
    this.loadUserEmailOnRepo = loadUserEmailOnRepo
    this.encrypter = encrypter
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
    if (!user) {
      return null
    }

    const isValid = await this.encrypter.compare(password, user.password)
    if (!isValid) {
      return null
    }
  }
}
