class LoadUserByEmailRepo {
  async load (email) {
    return null
  }
}

describe('LoadUserByEmail Repository', () => {
  test('Should return null if no user is found', async () => {
    const sut = new LoadUserByEmailRepo()
    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBeNull()
  })
})
