import { INestApplication, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { GitShaService } from '../src/version/git-sha.service';
import { VersionController } from '../src/version/version.controller';

const KNOWN_SHA = '0123456789abcdef0123456789abcdef01234567';

/**
 * Boots the full AppModule (all feature modules and their DI wiring) without a database,
 * so it can run in the pre-commit hook and before the first commit exists.
 */
describe('App smoke test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(GitShaService)
      .useValue({ getSha: () => KNOWN_SHA })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers GET /version and returns the commit SHA', () => {
    const controller = app.get(VersionController);
    expect(Reflect.getMetadata(PATH_METADATA, VersionController)).toBe('version');
    expect(Reflect.getMetadata(PATH_METADATA, controller.getVersion)).toBe('/');
    expect(Reflect.getMetadata(METHOD_METADATA, controller.getVersion)).toBe(RequestMethod.GET);
    expect(controller.getVersion()).toEqual({ sha: KNOWN_SHA });
  });
});
