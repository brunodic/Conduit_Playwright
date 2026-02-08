import prisma from '../config/database';
import { User, UserRole } from '@prisma/client';
import logger from '../config/logger';

export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGitHubId(githubId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { githubId },
    });
  }

  async create(data: {
    email: string;
    name?: string;
    githubId?: string;
    role?: UserRole;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        githubId: data.githubId,
        role: data.role || UserRole.VIEWER,
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async list(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new UserService();

