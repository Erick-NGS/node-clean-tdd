const sut = require('./mongo-helper')

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should return a connection when getConn() is called and client is disconnected', async () => {
    expect(sut.db).toBeTruthy()

    await sut.disconnect()

    expect(sut.db).toBeFalsy()

    await sut.getConn()

    expect(sut.db).toBeTruthy()
  })
})
