import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import env from './config/env';
import logger from './config/logger';
import prisma from './config/database';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import executionRoutes from './routes/executions';
import metricsRoutes from './routes/metrics';
import webhookRoutes from './routes/webhooks';
import { errorHandler } from './middleware/errorHandler';
import { rawBodyMiddleware } from './middleware/rawBody';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  })
);

// Session for OAuth flow
app.use(
  session({
    secret: env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
// Webhooks need raw body for signature verification
app.use('/api/webhooks', rawBodyMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Dashboard API v1.0' });
});

app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/webhooks', webhookRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = parseInt(env.PORT, 10);

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);

  // Test database connection
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

