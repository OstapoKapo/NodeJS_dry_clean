import { Controller, Get } from '@nestjs/common';
import { GitShaService } from './git-sha.service';

export interface VersionResponse {
  sha: string;
}

@Controller('version')
export class VersionController {
  constructor(private readonly gitSha: GitShaService) {}

  @Get()
  getVersion(): VersionResponse {
    return { sha: this.gitSha.getSha() };
  }
}
