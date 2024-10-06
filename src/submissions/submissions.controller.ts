import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateSubmissionDto } from './dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
@ApiTags('submissions')
@ApiBearerAuth()
@Roles(Role.USER, Role.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}
  @Post(':id')
  async create(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateSubmissionDto,
  ) {
    return await this.submissionsService.create(id, userId, dto);
  }
  @Get('')
  async get(@GetUser('id') userId: string) {
    return await this.submissionsService.get(userId);
  }
  @Get(':id')
  async getById(@Param('id') id: string, @GetUser('id') userId: string) {
    return await this.submissionsService.getById(id, userId);
  }
}
