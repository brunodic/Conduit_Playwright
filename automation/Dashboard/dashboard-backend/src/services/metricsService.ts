import prisma from '../config/database';
import { Metrics } from '@prisma/client';
import logger from '../config/logger';

export class MetricsService {
  async createOrUpdate(data: {
    executionId: string;
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    flakyTests?: string[];
  }): Promise<Metrics> {
    return prisma.metrics.upsert({
      where: { executionId: data.executionId },
      update: {
        totalTests: data.totalTests,
        passed: data.passed,
        failed: data.failed,
        skipped: data.skipped,
        flakyTests: data.flakyTests || [],
      },
      create: {
        executionId: data.executionId,
        totalTests: data.totalTests,
        passed: data.passed,
        failed: data.failed,
        skipped: data.skipped,
        flakyTests: data.flakyTests || [],
      },
    });
  }

  async getSummary(filters?: {
    projectId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};
    if (filters?.projectId) {
      where.execution = { projectId: filters.projectId };
    }
    if (filters?.startDate || filters?.endDate) {
      where.execution = {
        ...where.execution,
        createdAt: {
          ...(filters.startDate && { gte: filters.startDate }),
          ...(filters.endDate && { lte: filters.endDate }),
        },
      };
    }

    const metrics = await prisma.metrics.findMany({
      where,
      include: {
        execution: {
          select: {
            id: true,
            projectId: true,
            createdAt: true,
          },
        },
      },
    });

    const total = metrics.length;
    const totalTests = metrics.reduce((sum, m) => sum + m.totalTests, 0);
    const totalPassed = metrics.reduce((sum, m) => sum + m.passed, 0);
    const totalFailed = metrics.reduce((sum, m) => sum + m.failed, 0);
    const totalSkipped = metrics.reduce((sum, m) => sum + m.skipped, 0);
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

    return {
      total,
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
      successRate: Number(successRate.toFixed(2)),
    };
  }

  async getTrends(filters?: {
    projectId?: string;
    days?: number;
  }) {
    const days = filters?.days || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      execution: {
        createdAt: { gte: startDate },
      },
    };

    if (filters?.projectId) {
      where.execution.projectId = filters.projectId;
    }

    const metrics = await prisma.metrics.findMany({
      where,
      include: {
        execution: {
          select: {
            createdAt: true,
            projectId: true,
          },
        },
      },
      orderBy: {
        execution: {
          createdAt: 'asc',
        },
      },
    });

    // Group by date
    const grouped = metrics.reduce((acc, metric) => {
      const date = metric.execution.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          totalTests: 0,
          passed: 0,
          failed: 0,
          skipped: 0,
        };
      }
      acc[date].totalTests += metric.totalTests;
      acc[date].passed += metric.passed;
      acc[date].failed += metric.failed;
      acc[date].skipped += metric.skipped;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }

  async getFlakyTests(projectId?: string): Promise<string[]> {
    // This is a simplified implementation
    // A more sophisticated algorithm would compare test results across multiple executions
    const where: any = {};
    if (projectId) {
      where.execution = { projectId };
    }

    const metrics = await prisma.metrics.findMany({
      where,
      select: {
        flakyTests: true,
      },
    });

    const flakySet = new Set<string>();
    metrics.forEach((m) => {
      m.flakyTests.forEach((test) => flakySet.add(test));
    });

    return Array.from(flakySet);
  }
}

export default new MetricsService();

