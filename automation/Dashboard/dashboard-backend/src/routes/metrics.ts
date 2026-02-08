import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { errorHandler, AppError } from '../middleware/errorHandler';
import metricsService from '../services/metricsService';
import logger from '../config/logger';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get summary metrics
router.get('/summary', async (req, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const startDate = req.query.startDate 
      ? new Date(req.query.startDate as string) 
      : undefined;
    const endDate = req.query.endDate 
      ? new Date(req.query.endDate as string) 
      : undefined;

    const summary = await metricsService.getSummary({
      projectId,
      startDate,
      endDate,
    });

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

// Get trends
router.get('/trends', async (req, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const days = req.query.days 
      ? parseInt(req.query.days as string, 10) 
      : 30;

    const trends = await metricsService.getTrends({
      projectId,
      days,
    });

    res.json(trends);
  } catch (error) {
    next(error);
  }
});

// Get flaky tests
router.get('/flaky', async (req, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const flakyTests = await metricsService.getFlakyTests(projectId);
    res.json({ flakyTests });
  } catch (error) {
    next(error);
  }
});

export default router;

