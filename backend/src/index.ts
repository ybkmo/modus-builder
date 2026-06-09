import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectsRouter from './routes/projects';
import aiRouter from './routes/ai';
import deployRouter from './routes/deploy';
import { authMiddleware } from './middleware/auth';
import { rateLimiter } from './middleware/rateLimit';

dotenv.config();

export const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/projects', authMiddleware, projectsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/projects', authMiddleware, deployRouter);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  return res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
