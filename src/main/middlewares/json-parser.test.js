const request = require('supertest')

const app = require('../config/app')

describe('JSON Parser middleware', () => {
  test('Should parse body as JSON', async () => {
    app.post('/json_parser_test', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/json_parser_test')
      .send({ name: 'Json' })
      .expect({ name: 'Json' })
  })
})
