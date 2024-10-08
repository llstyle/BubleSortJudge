import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParticipantDto, CreateTeamDto } from './dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}
  async get(userId: string) {
    return await this.prisma.team.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }
  async getById(id: string) {
    return await this.prisma.team.findUnique({
      where: {
        id,
      },
    });
  }
  async create(userId: string, dto: CreateTeamDto) {
    return await this.prisma.team.create({
      data: {
        name: dto.name,
        owner: {
          connect: {
            id: userId,
          },
        },
        participants: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
  async update(userId: string, id: string, dto: UpdateTeamDto) {
    const team = this.prisma.team.findUnique({
      where: { id, ownerId: userId },
    });
    if (!team) {
      throw new BadRequestException(
        'team with this id and ownerId doesnt exist',
      );
    }
    return await this.prisma.team.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
      },
    });
  }
  async remove(userId: string, id: string) {
    const team = this.prisma.team.findUnique({
      where: { id, ownerId: userId },
    });
    if (!team) {
      throw new BadRequestException(
        'team with this id and ownerId doesnt exist',
      );
    }
    return await this.prisma.team.delete({
      where: {
        id,
      },
    });
  }
  async addParticipant(userId: string, id: string, dto: ParticipantDto) {
    const team = this.prisma.team.findUnique({
      where: { id, ownerId: userId },
    });
    if (!team) {
      throw new BadRequestException(
        'team with this id and ownerId doesnt exist',
      );
    }
    return await this.prisma.team.update({
      where: {
        id,
      },
      data: {
        participants: {
          connect: { id: dto.participant },
        },
      },
    });
  }
  async excludeParticipant(userId: string, id: string, dto: ParticipantDto) {
    const team = this.prisma.team.findUnique({
      where: { id, ownerId: userId },
    });
    if (!team) {
      throw new BadRequestException(
        'team with this id and ownerId doesnt exist',
      );
    }
    return await this.prisma.team.update({
      where: {
        id,
        owner: {
          isNot: {
            id: userId,
          },
        },
      },
      data: {
        participants: {
          disconnect: {
            id: dto.participant,
          },
        },
      },
    });
  }
}
