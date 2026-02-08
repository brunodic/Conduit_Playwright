import prisma from '../config/database';
import { Project } from '@prisma/client';
import logger from '../config/logger';

export class ProjectService {
  async create(data: {
    name: string;
    repositoryUrl: string;
    githubRepoId?: string;
    defaultBranch?: string;
  }): Promise<Project> {
    return prisma.project.create({
      data: {
        name: data.name,
        repositoryUrl: data.repositoryUrl,
        githubRepoId: data.githubRepoId,
        defaultBranch: data.defaultBranch || 'main',
      },
    });
  }

  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        executions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async list(): Promise<Project[]> {
    return prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { executions: true },
        },
      },
    });
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({
      where: { id },
    });
  }

  async findByRepositoryUrl(repositoryUrl: string): Promise<Project | null> {
    return prisma.project.findFirst({
      where: { repositoryUrl },
    });
  }
}

export default new ProjectService();

