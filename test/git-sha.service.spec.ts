import { GitShaService } from '../src/version/git-sha.service';

describe('GitShaService', () => {
  const original = process.env.GIT_SHA;

  afterEach(() => {
    if (original === undefined) delete process.env.GIT_SHA;
    else process.env.GIT_SHA = original;
  });

  it('prefers the GIT_SHA environment variable', () => {
    process.env.GIT_SHA = 'abc123';
    expect(new GitShaService().getSha()).toBe('abc123');
  });

  it('falls back to a 40-character SHA from git', () => {
    delete process.env.GIT_SHA;
    expect(new GitShaService().getSha()).toMatch(/^[0-9a-f]{40}$/);
  });
});
