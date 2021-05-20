const { MissingParamError } = require('../../utils/errors')

module.exports =
  class LoadUserByEmailRepo {
    constructor (userModel) {
      this.userModel = userModel
    }

    async load (email) {
      if (!email) {
        throw new MissingParamError('email')
      }
      const user = this.userModel.findOne({
        email
      }, {
        projection: {
          password: 1
        }
      })

      return user
    }
  }
