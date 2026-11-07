import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const auditScript = resolve(__dirname, '../scripts/audit-modules.mjs');
let fixture: string;

function write(path: string, content: string): void {
  const destination = join(fixture, path);
  mkdirSync(resolve(destination, '..'), { recursive: true });
  writeFileSync(destination, content);
}

function runAudit(): { status: number | null; output: string } {
  const result = spawnSync(process.execPath, [auditScript], { cwd: fixture, encoding: 'utf8' });
  return { status: result.status, output: result.stdout + result.stderr };
}

beforeEach(() => {
  fixture = mkdtempSync(join(tmpdir(), 'module-audit-'));
  write('tsconfig.json', JSON.stringify({ compilerOptions: { baseUrl: '.' } }));
  write('src/customers/customers.module.ts', '@Module({}) export class CustomersModule {}');
  write('src/customers/customers.service.ts', 'export class CustomersService {}');
  write('src/services/services.module.ts', '@Module({}) export class ServicesModule {}');
  write('src/services/services.service.ts', 'export class ServicesService {}');
  write(
    'src/orders/orders.module.ts',
    `import { CustomersModule } from '../customers/customers.module';
import { ServicesModule } from '../services/services.module';
@Module({ imports: [CustomersModule, ServicesModule] })
export class OrdersModule {}`,
  );
  write(
    'src/app.module.ts',
    `import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
@Module({ imports: [CustomersModule, ServicesModule, OrdersModule] })
export class AppModule {}`,
  );
});

afterEach(() => rmSync(fixture, { recursive: true, force: true }));

it('accepts the allowed module graph', () => {
  expect(runAudit().status).toBe(0);
});

it('rejects a forbidden path-alias import', () => {
  write(
    'src/customers/forbidden.ts',
    "import type { ServicesService } from 'src/services/services.service';",
  );
  const result = runAudit();
  expect(result.status).not.toBe(0);
  expect(result.output).toContain('customers must not import services');
});

it('rejects a missing OrdersModule dependency despite named import statements', () => {
  write(
    'src/orders/orders.module.ts',
    `import { CustomersModule } from '../customers/customers.module';
import { ServicesModule } from '../services/services.module';
@Module({ imports: [] })
export class OrdersModule {}`,
  );
  const result = runAudit();
  expect(result.status).not.toBe(0);
  expect(result.output).toContain('OrdersModule must import CustomersModule');
});

it('rejects a missing AppModule dependency despite named import statements', () => {
  write(
    'src/app.module.ts',
    `import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
@Module({ imports: [CustomersModule, ServicesModule] })
export class AppModule {}`,
  );
  const result = runAudit();
  expect(result.status).not.toBe(0);
  expect(result.output).toContain('AppModule must import OrdersModule');
});
