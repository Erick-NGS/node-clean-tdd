class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('EmailValidator', () => {
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isItValid = sut.isValid('test@test.com')

    expect(isItValid).toBe(true)
  })
})
