import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Verdict } from '@prisma/client';
import { Job } from 'bullmq';
import { exec as execCb } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';

const exec = promisify(execCb);

@Processor('judge')
export class JudgeConsumer extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    try {
      const tests = job.data.tests;
      const verdicts: Verdict[] = [];
      for (let i = 0; i < tests.length; i++) {
        const solutionLang = job.data.submission.language;
        const testerLang = job.data.tester.language;
        const solutionCode = job.data.submission.code;
        const testerCode = job.data.tester.code;
        const input = tests[i].input;
        const dirPath = join(process.cwd(), 'submissions', uuidv4());
        const inputPath = join(dirPath, 'input.txt');
        const outputPath = join(dirPath, 'output.txt');
        const solutionPath = join(dirPath, 'solution.' + solutionLang);
        const testerPath = join(dirPath, 'tester.' + testerLang);
        await mkdir(dirPath);
        await writeFile(inputPath, input);
        await writeFile(outputPath, '');
        await writeFile(solutionPath, solutionCode);
        await writeFile(testerPath, testerCode);
        await exec(
          `docker run --rm -v ${inputPath}:/usr/src/app/input.txt -v ${outputPath}:/usr/src/app/output.txt -v ${solutionPath}:/usr/src/app/solution.${solutionLang}:ro -v ${testerPath}:/usr/src/app/tester.${testerLang}:ro ${this.config.get('DOCKER_CONTAINER')}`,
        );
        const testVerdict: Verdict = (
          await readFile(outputPath)
        ).toString() as Verdict;
        verdicts.push(testVerdict);
        await rm(dirPath, { recursive: true });
      }
      let verdict: Verdict = 'OK';
      if (verdicts.includes('CE')) verdict = 'CE';
      else if (verdicts.includes('ML')) verdict = 'ML';
      else if (verdicts.includes('TL')) verdict = 'TL';
      else if (verdicts.includes('RE')) verdict = 'RE';
      else if (verdicts.includes('WA')) verdict = 'WA';
      await this.prisma.submission.update({
        where: { id: job.data.submission.id },
        data: { verdict },
      });
    } catch (e) {
      console.log(e);
      await this.prisma.submission.update({
        where: { id: job.data.submission.id },
        data: { verdict: Verdict.RE },
      });
    }
  }
}
