import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmissionDto } from './dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('judge') private judgeQueue: Queue,
  ) {}
  async get(userId: string) {
    const submission = await this.prisma.submission.findMany({
      where: { userId },
    });
    return submission;
  }
  async getById(id: string, userId: string) {
    return await this.prisma.submission.findUnique({ where: { id, userId } });
  }
  async create(id: string, userId: string, dto: CreateSubmissionDto) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: true,
        tester: {
          where: {
            active: true,
          },
        },
      },
    });
    if (!problem || problem.draft) {
      throw new BadRequestException('problem with this id isnt exist');
    }
    const submission = await this.prisma.submission.create({
      data: {
        problem: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        language: dto.language,
        code: dto.code,
      },
    });
    await this.judgeQueue.add('judge', {
      tests: problem.testCases,
      tester: problem.tester.at(-1),
      submission,
    });
    return submission;
  }
}
