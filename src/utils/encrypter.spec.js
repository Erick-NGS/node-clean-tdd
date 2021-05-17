const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

const makeSut = () => {
  return new Encrypter()
}

describe('Encrypter', () => {
  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    const isItValid = await sut.compare('any_value', 'hashed_value')

    expect(isItValid).toBe(true)
  })

  test('Should return true if bcrypt returns true', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isItValid = await sut.compare('any_value', 'hashed_value')

    expect(isItValid).toBe(false)
  })
})
