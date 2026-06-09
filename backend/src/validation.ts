import { z } from 'zod';

export const generateBlocksSchema = z.object({
  prompt: z.string().min(1).max(2000),
  projectId: z.string().uuid().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  blocks: z.array(z.record(z.any())).optional(),
});
