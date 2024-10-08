import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async get() {
    return await this.prisma.user.findMany();
  }
  async create(dto: CreateUserDto) {
    try {
      const password = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password,
          role: dto.role,
        },
      });
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'User with this username already exists',
          );
        }
      }
      throw e;
    }
  }
  async remove(id: string) {
    try {
      const user = this.prisma.user.delete({ where: { id, role: Role.USER } });
      return user;
    } catch (e) {
      throw e;
    }
  }
}
