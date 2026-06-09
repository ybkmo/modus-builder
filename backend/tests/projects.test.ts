import request from 'supertest';
import { app } from '../src/index';
import { resetProjects } from '../src/routes/projects';

describe('Projects API', () => {
  beforeEach(() => {
    resetProjects();
  });

  it('GET /api/projects returns an array', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/projects creates a project with agency template', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ name: 'Agency Site', userId: 'u1', templateId: 'agency' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Agency Site');
    expect(Array.isArray(res.body.blocks)).toBe(true);
    expect(res.body.blocks.length).toBeGreaterThan(0);
  });

  it('POST /api/projects without template creates empty blocks', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ name: 'Blank', userId: 'u1' });
    expect(res.status).toBe(201);
    expect(res.body.blocks).toEqual([]);
  });

  it('PUT /api/projects/:id updates blocks', async () => {
    const create = await request(app)
      .post('/api/projects')
      .send({ name: 'Updatable', userId: 'u1' });
    const id = create.body.id;

    const res = await request(app)
      .put(`/api/projects/${id}`)
      .send({ blocks: [{ type: 'hero', content: { title: 'Updated' } }] });
    expect(res.status).toBe(200);
    expect(res.body.blocks).toEqual([{ type: 'hero', content: { title: 'Updated' } }]);
  });
});
