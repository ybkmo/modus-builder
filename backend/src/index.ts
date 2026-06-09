import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectsRouter from './routes/projects';
import aiRouter from './routes/ai';
import deployRouter from './routes/deploy';
import { authMiddleware } from './middleware/auth';
import { aiRateLimiter, rateLimiter } from './middleware/rateLimit';
import pool from './db/connection';

dotenv.config();

export const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/projects', authMiddleware, projectsRouter);
app.use('/api/ai', aiRateLimiter, aiRouter);
app.use('/api/projects', authMiddleware, deployRouter);

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (err) {
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'disconnected',
    });
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  return res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, closing server gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}
