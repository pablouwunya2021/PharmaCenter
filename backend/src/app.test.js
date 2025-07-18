// app.test.js
const request = require('supertest');
const app = require('./app');

describe('Endpoints de la API PharmaCenter', () => {
  test('GET /ping debe responder pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('pong');
  });

  test('GET /api/medicamentos debe responder con lista de medicamentos', async () => {
    const res = await request(app).get('/api/medicamentos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/medicamentos con datos inválidos debe fallar', async () => {
    const res = await request(app)
      .post('/api/medicamentos')
      .send({}); // cuerpo vacío

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
