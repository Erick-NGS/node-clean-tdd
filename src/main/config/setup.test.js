const request = require('supertest')

const app = require('./app')

describe('App setup', () => {
  test('Should disable "x-powered-by" header', async () => {
    app.get('/header_test', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/header_test')

    expect(res.headers['x-powered-by']).toBeUndefined()
  })

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
