import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { errorHandler, AppError } from '../middleware/errorHandler';
import executionService from '../services/executionService';
import projectService from '../services/projectService';
import logger from '../config/logger';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

const createExecutionSchema = z.object({
  projectId: z.string().uuid(),
  branch: z.string().min(1),
  environment: z.enum(['dev', 'hml', 'prod']),
  suiteTags: z.array(z.string()).min(1),
});

// List executions
router.get('/', async (req, res, next) => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const status = req.query.status as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const result = await executionService.list({
      projectId,
      status: status as any,
      limit,
      offset,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get execution by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const execution = await executionService.findById(id);

    if (!execution) {
      throw new AppError(404, 'Execution not found');
    }

    res.json(execution);
  } catch (error) {
    next(error);
  }
});

// Create execution (trigger test run)
router.post(
  '/',
  requireRole('EXECUTOR', 'ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }

      const data = createExecutionSchema.parse(req.body);

      // Verify project exists
      const project = await projectService.findById(data.projectId);
      if (!project) {
        throw new AppError(404, 'Project not found');
      }

      // Create execution record
      const execution = await executionService.create({
        ...data,
        triggeredBy: req.user.id,
      });

      // TODO: Trigger GitHub Actions workflow
      // This will be implemented in the GitHub integration phase

      res.status(201).json(execution);
    } catch (error) {
      next(error);
    }
  }
);

// Get release gate status
router.get('/:id/release-gate', async (req, res, next) => {
  try {
    const { id } = req.params;
    const execution = await executionService.findById(id);

    if (!execution) {
      throw new AppError(404, 'Execution not found');
    }

    if (!execution.metrics) {
      res.json({
        canRelease: false,
        reason: 'Execution not completed or metrics not available',
      });
      return;
    }

    // TODO: Implement release gate logic based on project rules
    // This will be implemented in the release decision phase

    const metrics = execution.metrics;
    const failureRate = metrics.totalTests > 0 
      ? (metrics.failed / metrics.totalTests) * 100 
      : 0;

    const canRelease = failureRate < 10 && metrics.failed === 0;

    res.json({
      canRelease,
      failureRate: Number(failureRate.toFixed(2)),
      metrics: {
        total: metrics.totalTests,
        passed: metrics.passed,
        failed: metrics.failed,
        skipped: metrics.skipped,
      },
      reason: canRelease 
        ? 'All checks passed' 
        : `Failure rate ${failureRate.toFixed(2)}% exceeds threshold`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

