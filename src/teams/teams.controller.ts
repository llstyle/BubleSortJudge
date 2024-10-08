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
import { TeamsService } from './teams.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateTeamDto, ParticipantDto } from './dto';

@ApiTags('teams')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  @Get('')
  async get(@GetUser('id') userId: string) {
    return await this.teamsService.get(userId);
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.teamsService.getById(id);
  }
  @Post('')
  async create(@GetUser('id') userId: string, @Body() dto: CreateTeamDto) {
    return await this.teamsService.create(userId, dto);
  }
  @Patch(':id')
  async update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateTeamDto,
  ) {
    return await this.teamsService.update(userId, id, dto);
  }
  @Delete(':id')
  async remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return await this.teamsService.remove(userId, id);
  }
  @Post('participant/:id')
  async addParticipant(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: ParticipantDto,
  ) {
    return await this.teamsService.addParticipant(userId, id, dto);
  }
  @Delete('participant/:id')
  async excludeParticipant(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: ParticipantDto,
  ) {
    return await this.teamsService.excludeParticipant(userId, id, dto);
  }
}
