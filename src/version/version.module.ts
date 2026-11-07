import { Module } from '@nestjs/common';
import { GitShaService } from './git-sha.service';
import { VersionController } from './version.controller';

@Module({
  controllers: [VersionController],
  providers: [GitShaService],
})
export class VersionModule {}
