import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { errorHandler, AppError } from '../middleware/errorHandler';
import projectService from '../services/projectService';
import logger from '../config/logger';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  repositoryUrl: z.string().url(),
  githubRepoId: z.string().optional(),
  defaultBranch: z.string().default('main'),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  repositoryUrl: z.string().url().optional(),
  defaultBranch: z.string().optional(),
});

// List all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await projectService.list();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Get project by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await projectService.findById(id);

    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Create project (requires EXECUTOR or ADMIN role)
router.post(
  '/',
  requireRole('EXECUTOR', 'ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = createProjectSchema.parse(req.body);

      // Check if project with same URL already exists
      const existing = await projectService.findByRepositoryUrl(data.repositoryUrl);
      if (existing) {
        throw new AppError(409, 'Project with this repository URL already exists');
      }

      const project = await projectService.create(data);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }
);

// Update project (requires EXECUTOR or ADMIN role)
router.put(
  '/:id',
  requireRole('EXECUTOR', 'ADMIN'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = updateProjectSchema.parse(req.body);

      const project = await projectService.update(id, data);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }
);

// Delete project (requires ADMIN role)
router.delete(
  '/:id',
  requireRole('ADMIN'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await projectService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;

