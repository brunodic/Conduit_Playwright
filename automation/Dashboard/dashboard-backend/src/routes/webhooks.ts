import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import env from '../config/env';
import executionService from '../services/executionService';
import logger from '../config/logger';
import { ExecutionStatus } from '@prisma/client';
import { rawBodyMiddleware } from '../middleware/rawBody';

const router = Router();

// Verify webhook signature
const verifySignature = (payload: string, signature: string): boolean => {
  const hmac = crypto.createHmac('sha256', env.GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

// GitHub webhook endpoint
router.post('/github', rawBodyMiddleware, async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const event = req.headers['x-github-event'] as string;

    if (!signature) {
      logger.warn('Webhook request without signature');
      return res.status(401).json({ error: 'Missing signature' });
    }

    // Get raw body as string for signature verification
    const payload = (req as any).rawBody || JSON.stringify(req.body);
    
    // Verify signature
    if (!verifySignature(payload, signature)) {
      logger.warn('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    logger.info(`Received webhook event: ${event}`);

    // Handle workflow_run events
    if (event === 'workflow_run') {
      const { action, workflow_run } = req.body;

      if (action === 'completed' || action === 'in_progress' || action === 'requested') {
        const githubRunId = workflow_run.id.toString();

        // Find execution by GitHub run ID
        const execution = await executionService.findByGitHubRunId(githubRunId);

        if (!execution) {
          logger.warn(`Execution not found for GitHub run ID: ${githubRunId}`);
          return res.status(404).json({ error: 'Execution not found' });
        }

        // Update execution status
        let status: ExecutionStatus;
        switch (workflow_run.conclusion) {
          case 'success':
            status = ExecutionStatus.PASSED;
            break;
          case 'failure':
          case 'cancelled':
            status = ExecutionStatus.FAILED;
            break;
          default:
            status = ExecutionStatus.RUNNING;
        }

        if (action === 'in_progress' || action === 'requested') {
          status = ExecutionStatus.RUNNING;
        }

        await executionService.updateStatus(execution.id, status, githubRunId);

        // Calculate duration if completed
        if (action === 'completed' && workflow_run.updated_at) {
          const startedAt = new Date(workflow_run.created_at);
          const completedAt = new Date(workflow_run.updated_at);
          const durationMs = completedAt.getTime() - startedAt.getTime();
          await executionService.updateDuration(execution.id, durationMs);
        }

        logger.info(`Updated execution ${execution.id} to status ${status}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

