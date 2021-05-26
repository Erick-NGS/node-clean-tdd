const request = require('supertest')

const app = require('../config/app')

describe('Content-Type middleware', () => {
  test('Should return JSON Content Type as default', async () => {
    app.get('/content_type_test', (req, res) => {
      res.send({})
    })

    await request(app)
      .get('/content_type_test')
      .expect('content-type', /json/)
  })
})
