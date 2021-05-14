const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
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

    const user = await this.loadUserEmailOnRepo.load(email)

    if (!user) {
      return null
    }
    return null
  }
}
