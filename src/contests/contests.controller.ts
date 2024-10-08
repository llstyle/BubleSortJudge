import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContestsService } from './contests.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateContestDto, UpdateContestDto } from './dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('contests')
@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}
  @Get('')
  async get(@GetUser('id') userId: string) {
    return await this.contestsService.get(userId);
  }
  @Get('team/:id')
  async getByTeam(@GetUser('id') userId: string, @Param('id') id: string) {
    return await this.contestsService.getByTeam(userId, id);
  }
  @Get(':id')
  async getById(@GetUser('id') userId: string, @Param('id') id: string) {
    return await this.contestsService.getById(userId, id);
  }
  @Roles(Role.ADMIN)
  @Post('')
  async create(@Body() dto: CreateContestDto) {
    return await this.contestsService.create(dto);
  }
  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContestDto,
  ) {
    return await this.contestsService.update(dto, id, userId);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return await this.contestsService.remove(id, userId);
  }
}
