const request = require('supertest')

const app = require('../config/app')

describe('Content-Type middleware', () => {
  test('Should return JSON content-type as default', async () => {
    app.get('/content_type_test', (req, res) => {
      res.send('')
    })

    await request(app)
      .get('/content_type_test')
      .expect('content-type', /json/)
  })

  test('Should return XML content-type', async () => {
    app.get('/content_type_test_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/content_type_test_xml')
      .expect('content-type', /xml/)
  })
})
