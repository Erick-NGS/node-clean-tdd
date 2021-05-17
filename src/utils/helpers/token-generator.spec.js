const makeSut = () => {
  class TokenGenerator {
    async generate (id) {
      return null
    }
  }

  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('Should return null if jwt returns null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')

    expect(token).toBeNull()
  })
})
