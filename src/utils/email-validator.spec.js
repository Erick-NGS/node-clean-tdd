const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
}

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('EmailValidator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isItValid = sut.isValid('test@test.com')

    expect(isItValid).toBe(true)
  })

  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isItValid = sut.isValid('bad_email@test.com')

    expect(isItValid).toBe(false)
  })

  test('Should call validator with correct param', () => {
    const sut = makeSut()
    const testEmail = 'email@test.com'
    sut.isValid(testEmail)

    expect(validator.email).toBe(testEmail)
  })
})
