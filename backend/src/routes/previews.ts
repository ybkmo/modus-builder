import { Router } from 'express';

const router = Router();

const previews = new Map<string, { blocks: unknown[]; expireAt: number }>();
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function scheduleExpiration(id: string) {
  setTimeout(() => {
    previews.delete(id);
  }, TWENTY_FOUR_HOURS);
}

router.post('/', (req, res) => {
  const { blocks } = req.body;
  if (!Array.isArray(blocks)) {
    return res.status(400).json({ error: 'blocks must be an array' });
  }
  const id = generateId();
  previews.set(id, { blocks, expireAt: Date.now() + TWENTY_FOUR_HOURS });
  scheduleExpiration(id);
  return res.status(201).json({ previewId: id });
});

router.get('/:id', (req, res) => {
  const preview = previews.get(req.params.id);
  if (!preview) {
    return res.status(404).json({ error: 'Preview not found' });
  }
  if (Date.now() > preview.expireAt) {
    previews.delete(req.params.id);
    return res.status(404).json({ error: 'Preview expired' });
  }
  return res.json({ blocks: preview.blocks });
});

export function resetPreviews() {
  previews.clear();
}

export default router;
