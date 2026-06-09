import request from 'supertest';
import { app } from '../src/index';
import { resetProjects } from '../src/routes/projects';

describe('Deploy API', () => {
  beforeEach(() => {
    resetProjects();
  });

  it('POST /api/projects/:id/deploy returns deployed url', async () => {
    const create = await request(app)
      .post('/api/projects')
      .send({ name: 'Deploy Me', userId: 'u1' });
    const id = create.body.id;

    const res = await request(app)
      .post(`/api/projects/${id}/deploy`)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.url).toBe(`https://preview.modus.app/build-${id}.html`);
    expect(res.body.status).toBe('deployed');
  });
});
