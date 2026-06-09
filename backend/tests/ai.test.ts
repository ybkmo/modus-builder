import request from 'supertest';
import { app } from '../src/index';

describe('AI API', () => {
  it('POST /api/ai/generate returns blocks matching keywords', async () => {
    const res = await request(app)
      .post('/api/ai/generate')
      .send({ prompt: 'I need a hero and pricing section' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('blocks');
    expect(Array.isArray(res.body.blocks)).toBe(true);
    expect(res.body.blocks.length).toBe(2);
    expect(res.body.blocks[0].type).toBe('hero');
    expect(res.body.blocks[1].type).toBe('pricing_table');
  });

  it('returns default blocks when no keywords match', async () => {
    const res = await request(app)
      .post('/api/ai/generate')
      .send({ prompt: 'something random xyz' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.blocks)).toBe(true);
    expect(res.body.blocks.length).toBeGreaterThanOrEqual(1);
  });

  it('returns 400 when prompt is missing', async () => {
    const res = await request(app)
      .post('/api/ai/generate')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.issues).toBeDefined();
    expect(res.body.issues.length).toBeGreaterThan(0);
  });
});
