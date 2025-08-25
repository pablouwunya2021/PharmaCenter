const request = require('supertest');
const express = require('express');

function buildApp() {
  const app = express();
  app.get('/users', (_req, res) => {
    res.json([{ id: 1, name: 'Alice' }]);
  });
  return app;
}

describe('GET /users', () => {
  test('responde 200 y JSON con usuarios', async () => {
    const app = buildApp();
    const res = await request(app).get('/users').expect('Content-Type', /json/).expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ id: 1, name: 'Alice' });
  });
});
