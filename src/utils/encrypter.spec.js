class Encrypter {
  async compare (password, hashedPassword) {
    return true
  }
}

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const isItValid = await sut.compare('any_pass', 'hashed_pass')

    expect(isItValid).toBe(true)
  })
})
