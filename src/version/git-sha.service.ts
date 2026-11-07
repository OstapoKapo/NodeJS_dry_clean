import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { execFileSync } from 'node:child_process';

/**
 * Resolves the Git commit SHA of the running code.
 * Order: `GIT_SHA` environment variable, then `git rev-parse HEAD`.
 * The value is resolved once and cached. Tests replace this provider with a known SHA.
 */
@Injectable()
export class GitShaService {
  private cached?: string;

  getSha(): string {
    this.cached ??= this.resolve();
    return this.cached;
  }

  private resolve(): string {
    const fromEnv = process.env.GIT_SHA?.trim();
    if (fromEnv) return fromEnv;
    try {
      return execFileSync('git', ['rev-parse', 'HEAD'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    } catch {
      throw new ServiceUnavailableException('Git commit SHA is unavailable');
    }
  }
}
