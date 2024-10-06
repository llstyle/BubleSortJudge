import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddTestDto,
  AddTesterDto,
  CreateProblemDto,
  UpdateProblemDto,
  UpdateTestDto,
  UpdateTesterDto,
} from './dto';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}
  async get() {
    return await this.prisma.problem.findMany({});
  }
  async getById(id: string) {
    return await this.prisma.problem.findUnique({ where: { id } });
  }
  async getTestCases(id: string) {
    return await this.prisma.testCase.findMany({
      where: {
        problemId: id,
      },
    });
  }
  async getTestCaseById(id: string) {
    return await this.prisma.testCase.findMany({
      where: {
        id,
      },
    });
  }
  async getTesters(id: string) {
    return await this.prisma.tester.findMany({
      where: {
        problemId: id,
      },
    });
  }
  async getTesterById(id: string) {
    return await this.prisma.tester.findUnique({
      where: {
        id,
      },
    });
  }
  async create(dto: CreateProblemDto) {
    const problem = await this.prisma.problem.create({
      data: {
        name: dto.name,
        description: dto.description,
        rating: dto.rating,
      },
    });
    return problem;
  }
  async addTestCase(id: string, dto: AddTestDto) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      throw new BadRequestException('problem with this id doesnt exist');
    }
    const testCase = this.prisma.testCase.create({
      data: {
        problem: {
          connect: {
            id,
          },
        },
        input: dto.input,
      },
    });
    return testCase;
  }
  async addTester(id: string, dto: AddTesterDto) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
    });
    if (!problem) {
      throw new BadRequestException('problem with this id doesnt exist');
    }
    const tester = this.prisma.tester.create({
      data: {
        problem: {
          connect: {
            id,
          },
        },
        language: dto.language,
        code: dto.code,
      },
    });
    return tester;
  }
  async updateProblem(id: string, dto: UpdateProblemDto) {
    return this.prisma.problem.update({
      where: { id },
      data: dto,
    });
  }
  async updateTester(id: string, dto: UpdateTesterDto) {
    return this.prisma.tester.update({
      where: { id },
      data: dto,
    });
  }
  async updateTestCase(id: string, dto: UpdateTestDto) {
    return this.prisma.testCase.update({
      where: { id },
      data: dto,
    });
  }
  async removeTestCase(id: string) {
    const testCase = this.prisma.testCase.delete({ where: { id } });
    return testCase;
  }
  async removeTester(id: string) {
    const tester = this.prisma.tester.delete({ where: { id } });
    return tester;
  }
  async removeProblem(id: string) {
    const problem = this.prisma.problem.delete({ where: { id } });
    return problem;
  }
}
