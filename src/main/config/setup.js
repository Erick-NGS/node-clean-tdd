const cors = require('../middlewares/cors')
const bodyParser = require('../middlewares/json-parser')
const contentType = require('../middlewares/content-type')

module.exports = app => {
  app.disable('x-powered-by')

  app.use(cors)
  app.use(bodyParser)
  app.use(contentType)
}
