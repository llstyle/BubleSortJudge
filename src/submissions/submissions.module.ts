import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JudgeConsumer } from './processors/judge.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'judge',
    }),
    PrismaModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, JudgeConsumer],
})
export class SubmissionsModule {}
