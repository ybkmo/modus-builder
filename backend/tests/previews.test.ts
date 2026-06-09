import request from 'supertest';
import { app } from '../src/index';
import { resetPreviews } from '../src/routes/previews';

describe('Previews API', () => {
  beforeEach(() => {
    resetPreviews();
  });

  it('POST /api/previews returns a previewId', async () => {
    const res = await request(app)
      .post('/api/previews')
      .send({ blocks: [{ id: '1', type: 'hero', props: { title: 'Hello' } }] });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('previewId');
    expect(typeof res.body.previewId).toBe('string');
  });

  it('POST /api/previews requires blocks array', async () => {
    const res = await request(app).post('/api/previews').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('blocks must be an array');
  });

  it('GET /api/previews/:id returns saved blocks', async () => {
    const create = await request(app)
      .post('/api/previews')
      .send({ blocks: [{ id: '1', type: 'text', props: { content: 'World' } }] });
    const id = create.body.previewId;

    const res = await request(app).get(`/api/previews/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.blocks).toEqual([{ id: '1', type: 'text', props: { content: 'World' } }]);
  });

  it('GET /api/previews/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/previews/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Preview not found');
  });
});
