const { MongoClient } = require('mongodb')

let client, db

class LoadUserByEmailRepo {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
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

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepo(userModel)

  return {
    userModel,
    sut
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })

  test('Should return an user if an user is found', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      password: 'hashed_pass',
      name: 'any_name',
      age: 25
    })
    const user = await sut.load('valid_email@mail.com')

    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })
})
