const request = require('supertest')

const app = require('../config/app')

describe('CORS setup', () => {
  test('Should enable CORS', async () => {
    app.get('/cors_test', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/cors_test')

    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })
})
