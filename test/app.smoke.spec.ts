import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Agent, get, Server } from 'node:http';
import { Socket } from 'node:net';
import { Duplex } from 'node:stream';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { GitShaService } from '../src/version/git-sha.service';

const KNOWN_SHA = '0123456789abcdef0123456789abcdef01234567';

function socketPair(): [Duplex, Duplex] {
  const client = new Duplex({
    read() {},
    write(chunk, _encoding, done) {
      server.push(chunk);
      done();
    },
    final(done) {
      server.push(null);
      done();
    },
  });
  const server = new Duplex({
    read() {},
    write(chunk, _encoding, done) {
      client.push(chunk);
      done();
    },
    final(done) {
      client.push(null);
      done();
    },
  });
  for (const socket of [client, server]) {
    Object.assign(socket, {
      setTimeout: () => socket,
      setNoDelay: () => socket,
      setKeepAlive: () => socket,
      ref: () => socket,
      unref: () => socket,
    });
  }
  return [client, server];
}

async function getVersionOverHttp(
  server: Server,
): Promise<{ status: number | undefined; body: string }> {
  const agent = new Agent();
  agent.createConnection = () => {
    const [client, serverSocket] = socketPair();
    process.nextTick(() => server.emit('connection', serverSocket));
    return client as Socket;
  };

  try {
    return await new Promise((resolve, reject) => {
      get({ host: 'localhost', path: '/version', agent }, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk: string) => (body += chunk));
        response.on('end', () => resolve({ status: response.statusCode, body }));
        response.on('error', reject);
      }).on('error', reject);
    });
  } finally {
    agent.destroy();
  }
}

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

  it('serves GET /version through HTTP with the commit SHA', async () => {
    const response = await getVersionOverHttp(app.getHttpServer() as Server);
    expect(response.status).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ sha: KNOWN_SHA });
  });
});
