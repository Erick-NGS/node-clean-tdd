const { MissingParamError } = require('../../utils/errors')
module.exports = class UpdateAccessTokenRepo {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}
