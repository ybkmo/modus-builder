import { Router } from 'express';

const router = Router();

router.post('/:id/deploy', (req, res) => {
  const { id } = req.params;
  return res.json({
    url: `https://preview.modus.app/build-${id}.html`,
    status: 'deployed'
  });
});

export default router;
