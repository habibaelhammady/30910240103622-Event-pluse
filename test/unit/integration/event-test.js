const request = require('supertest');
const app = require('../../../app'); 

describe('Events API Integration Tests', () => {

  test('POST /api/events - should create a new event when payload is valid', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        title: 'Tech Conference 2026',
        category: 'Technology',
        date: '2026-10-15'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

    test('GET /api/events - should return all events', async () => {
    const res = await request(app).get('/api/events');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data || res.body)).toBe(true);
  });

  test('GET /api/events?category=Technology - should filter events by query parameter', async () => {
    const res = await request(app).get('/api/events?category=Technology');

    expect(res.statusCode).toBe(200);
  });
});