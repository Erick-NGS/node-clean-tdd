const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepo = require('./update-access-token-repo')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepo(userModel)

  return {
    userModel,
    sut
  }
}

describe('UpdateAccessToken Repo', () => {
  let fakeUserId
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getConn()
  })

  beforeEach(async () => {
    const userModel = db.collection('users')
    await userModel.deleteMany()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_pass',
      name: 'any_name',
      age: 25
    })
    fakeUserId = fakeUser.ops[0]._id
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with the given access token', async () => {
    const { sut, userModel } = makeSut()

    await sut.update(fakeUserId, 'valid_token')

    const updatedInfo = await userModel.findOne({
      _id: fakeUserId
    })

    expect(updatedInfo.accessToken).toBe('valid_token')
  })

  test('Should throw if no userModel is found', async () => {
    const sut = new UpdateAccessTokenRepo()
    const promise = sut.update(fakeUserId, 'valid_token')

    expect(promise).rejects.toThrow()
  })

  test('Should throw if no params are provided', async () => {
    const { sut } = makeSut()

    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
