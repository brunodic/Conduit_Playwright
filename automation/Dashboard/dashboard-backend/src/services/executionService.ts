import prisma from '../config/database';
import { Execution, ExecutionStatus } from '@prisma/client';
import logger from '../config/logger';

export class ExecutionService {
  async create(data: {
    projectId: string;
    branch: string;
    environment: string;
    suiteTags: string[];
    triggeredBy: string;
    githubRunId?: string;
  }): Promise<Execution> {
    return prisma.execution.create({
      data: {
        projectId: data.projectId,
        branch: data.branch,
        environment: data.environment,
        suiteTags: data.suiteTags,
        triggeredBy: data.triggeredBy,
        githubRunId: data.githubRunId,
        status: ExecutionStatus.PENDING,
      },
    });
  }

  async findById(id: string): Promise<Execution | null> {
    return prisma.execution.findUnique({
      where: { id },
      include: {
        project: true,
        triggeredByUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        testResults: {
          orderBy: { createdAt: 'asc' },
        },
        metrics: true,
      },
    });
  }

  async list(filters?: {
    projectId?: string;
    status?: ExecutionStatus;
    limit?: number;
    offset?: number;
  }): Promise<{ executions: Execution[]; total: number }> {
    const where: any = {};
    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }

    const [executions, total] = await Promise.all([
      prisma.execution.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          triggeredByUser: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          metrics: true,
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      }),
      prisma.execution.count({ where }),
    ]);

    return { executions, total };
  }

  async updateStatus(
    id: string,
    status: ExecutionStatus,
    githubRunId?: string
  ): Promise<Execution> {
    const updateData: any = { status };

    if (status === ExecutionStatus.RUNNING && !githubRunId) {
      updateData.startedAt = new Date();
    }

    if (
      [ExecutionStatus.PASSED, ExecutionStatus.FAILED, ExecutionStatus.CANCELLED].includes(
        status
      )
    ) {
      updateData.completedAt = new Date();
    }

    if (githubRunId) {
      updateData.githubRunId = githubRunId;
    }

    return prisma.execution.update({
      where: { id },
      data: updateData,
    });
  }

  async updateDuration(id: string, durationMs: number): Promise<Execution> {
    return prisma.execution.update({
      where: { id },
      data: { durationMs },
    });
  }

  async findByGitHubRunId(githubRunId: string): Promise<Execution | null> {
    return prisma.execution.findUnique({
      where: { githubRunId },
    });
  }
}

export default new ExecutionService();

