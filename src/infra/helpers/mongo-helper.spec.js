const MongoHelper = require('./mongo-helper')

describe('Mongo Helper', () => {
  test('Should return a connection when getConn() is called and client is disconnected', async () => {
    const sut = MongoHelper
    await sut.connect(process.env.MONGO_URL)

    expect(sut.db).toBeTruthy()

    await sut.disconnect()

    expect(sut.db).toBeFalsy()

    await sut.getConn()

    expect(sut.db).toBeTruthy()
  })
})
