const EmailValidator = require('./email-validator')
const { MissingParamError } = require('../errors')

const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
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

  test('Should throw if no email is provided', async () => {
    const sut = makeSut()

    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
    // expect(sut.isValid).toThrow(new MissingParamError('email'))
    // When testing a method which is not async, we have to pass the pointer of the func (without the parenthesis on the method)
  })
})
