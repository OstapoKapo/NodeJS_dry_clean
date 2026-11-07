import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const source = resolve('src');
const features = ['customers', 'services', 'orders'];
const failures = [];

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

for (const feature of features) {
  for (const file of filesIn(join(source, feature)).filter((path) => path.endsWith('.ts'))) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      if (!match[1].startsWith('.')) continue;
      const imported = resolve(file, '..', match[1]);
      const target = features.find((name) => imported.startsWith(join(source, name) + '/'));
      if (target && target !== feature && feature !== 'orders') {
        failures.push(`${file}: ${feature} must not import ${target}`);
      }
    }
  }
}

const ordersModule = readFileSync(join(source, 'orders/orders.module.ts'), 'utf8');
for (const moduleName of ['CustomersModule', 'ServicesModule']) {
  if (!ordersModule.includes(moduleName)) failures.push(`OrdersModule must import ${moduleName}`);
}
const appModule = readFileSync(join(source, 'app.module.ts'), 'utf8');
for (const moduleName of ['CustomersModule', 'ServicesModule', 'OrdersModule']) {
  if (!appModule.includes(moduleName)) failures.push(`AppModule must import ${moduleName}`);
}
if (filesIn(source).some((file) => /order.?items?\.module\.ts$/i.test(file))) {
  failures.push('Order items must not have a separate module');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Module dependency audit passed');
}
