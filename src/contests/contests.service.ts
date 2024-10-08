import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContestDto, UpdateContestDto } from './dto';

@Injectable()
export class ContestsService {
  constructor(private prisma: PrismaService) {}
  async get(userId: string) {
    return await this.prisma.contest.findMany({
      where: {
        team: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        problems: true,
      },
    });
  }
  async getByTeam(userId: string, teamId: string) {
    return await this.prisma.contest.findMany({
      where: {
        team: {
          id: teamId,
          participants: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        problems: true,
      },
    });
  }
  async getById(userId: string, id: string) {
    return await this.prisma.contest.findUnique({
      where: {
        id,
        team: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
      },
      include: {
        problems: true,
      },
    });
  }
  async create(dto: CreateContestDto) {
    return await this.prisma.contest.create({
      data: {
        problems: {
          connect: dto.problems.map((id) => ({ id })),
        },
        team: {
          connect: {
            id: dto.teamId,
          },
        },
        name: dto.name,
        timeEnd: dto.timeEnd,
      },
    });
  }
  async update(dto: UpdateContestDto, id: string, userId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: {
        id,
        team: {
          ownerId: userId,
        },
      },
    });
    if (!contest) {
      throw new BadRequestException(
        'contest with that id and owner doesnt exist',
      );
    }
    await this.prisma.contest.update({
      where: {
        id,
      },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.timeEnd && { timeEnd: dto.timeEnd }),
        ...(dto.problems && {
          problems: {
            set: dto.problems.map((id) => ({ id })),
          },
        }),
      },
    });
  }
  async remove(id: string, userId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: {
        id,
        team: {
          ownerId: userId,
        },
      },
    });
    if (!contest) {
      throw new BadRequestException(
        'contest with that id and owner doesnt exist',
      );
    }
    return await this.prisma.contest.delete({ where: { id } });
  }
}
