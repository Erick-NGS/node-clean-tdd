module.exports = (req, res, next) => {
  res.type('json')

  // has the purpose of not locking this middleware
  next()
}
