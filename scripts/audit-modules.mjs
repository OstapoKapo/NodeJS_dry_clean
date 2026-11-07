import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const source = join(root, 'src');
const features = ['customers', 'services', 'orders'];
const failures = [];

const configPath = ts.findConfigFile(root, ts.sys.fileExists, 'tsconfig.json');
if (!configPath) throw new Error('tsconfig.json is required for the module audit');
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options;

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function parse(file) {
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}

function featureOf(file) {
  const parts = relative(source, file).split(sep);
  return features.includes(parts[0]) ? parts[0] : undefined;
}

function importSpecifiers(node, found = []) {
  if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
    found.push(node.moduleSpecifier);
  } else if (
    ts.isImportEqualsDeclaration(node) &&
    ts.isExternalModuleReference(node.moduleReference)
  ) {
    found.push(node.moduleReference.expression);
  } else if (
    ts.isCallExpression(node) &&
    (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
      (ts.isIdentifier(node.expression) && node.expression.text === 'require'))
  ) {
    found.push(node.arguments[0]);
  }
  ts.forEachChild(node, (child) => importSpecifiers(child, found));
  return found;
}

for (const feature of features) {
  for (const file of filesIn(join(source, feature)).filter((path) => path.endsWith('.ts'))) {
    for (const specifier of importSpecifiers(parse(file))) {
      if (!specifier || !ts.isStringLiteralLike(specifier)) continue;
      const resolved = ts.resolveModuleName(specifier.text, file, options, ts.sys).resolvedModule;
      const target = resolved && featureOf(resolved.resolvedFileName);
      if (target && target !== feature && feature !== 'orders') {
        failures.push(`${relative(root, file)}: ${feature} must not import ${target}`);
      }
    }
  }
}

function moduleImports(file, className) {
  const declaration = parse(file).statements.find(
    (node) => ts.isClassDeclaration(node) && node.name?.text === className,
  );
  const decorator =
    declaration &&
    ts
      .getDecorators(declaration)
      ?.find(
        (node) =>
          ts.isCallExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === 'Module',
      );
  const metadata = decorator?.expression.arguments[0];
  if (!metadata || !ts.isObjectLiteralExpression(metadata)) return undefined;
  const imports = metadata.properties.find(
    (property) => ts.isPropertyAssignment(property) && property.name.getText() === 'imports',
  );
  if (!imports || !ts.isArrayLiteralExpression(imports.initializer)) return [];
  return imports.initializer.elements.map((element) => element.getText());
}

for (const [file, className, required] of [
  ['src/orders/orders.module.ts', 'OrdersModule', ['CustomersModule', 'ServicesModule']],
  ['src/app.module.ts', 'AppModule', ['CustomersModule', 'ServicesModule', 'OrdersModule']],
]) {
  const imports = moduleImports(join(root, file), className);
  if (!imports) failures.push(`${className} must have a @Module decorator`);
  for (const moduleName of required) {
    if (!imports?.includes(moduleName)) failures.push(`${className} must import ${moduleName}`);
  }
}

for (const [feature, className] of [
  ['customers', 'CustomersModule'],
  ['services', 'ServicesModule'],
]) {
  const imports = moduleImports(join(source, feature, `${feature}.module.ts`), className);
  if (!imports) failures.push(`${className} must have a @Module decorator`);
  for (const moduleName of ['CustomersModule', 'ServicesModule', 'OrdersModule']) {
    if (imports?.includes(moduleName)) failures.push(`${className} must not import ${moduleName}`);
  }
}

if (filesIn(source).some((file) => /order.?items?\.module\.ts$/i.test(file))) {
  failures.push('Order items must not have a separate module');
}
if (filesIn(source).some((file) => file.endsWith('version.module.ts'))) {
  failures.push('The version endpoint belongs in AppModule, not a separate module');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Module dependency audit passed');
}
