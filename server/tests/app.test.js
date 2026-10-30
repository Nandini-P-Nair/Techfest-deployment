process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_test_secret_test_secret_123';
const request = require('supertest');
const app = require('../app');

const CSRF = { 'X-Requested-With': 'XMLHttpRequest' };

describe('TechFest API', () => {
  test('health check returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('Helmet security headers are present', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  test('NoSQL injection payload in login is rejected', async () => {
    const res = await request(app).post('/api/auth/login').set(CSRF)
      .send({ email: { $gt: '' }, password: { $gt: '' } });
    expect(res.status).toBe(400);
  });

  test('POST without CSRF header is blocked', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com', password: 'password123' });
    expect(res.status).toBe(403);
  });

  test('protected route needs a login cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('unknown API route returns 404', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
  });
});
