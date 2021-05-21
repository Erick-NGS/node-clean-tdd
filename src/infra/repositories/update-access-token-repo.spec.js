const MongoHelper = require('../helpers/mongo-helper')

let db

class UpdateAccessTokenRepo {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

describe('UpdateAccessToken Repo', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getConn()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with the given access token', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepo(userModel)
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_pass',
      name: 'any_name',
      age: 25
    })
    await sut.update(fakeUser.ops[0]._id, 'valid_token')

    const updatedInfo = await userModel.findOne({
      _id: fakeUser.ops[0]._id
    })

    expect(updatedInfo.accessToken).toBe('valid_token')
  })

  test('Should throw if no userModel is found', async () => {
    const userModel = db.collection('users')
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_pass',
      name: 'any_name',
      age: 25
    })
    const sut = new UpdateAccessTokenRepo()
    const promise = sut.update(fakeUser.ops[0]._id, 'valid_token')

    expect(promise).rejects.toThrow()
  })
})
