.PHONY: install hooks format format-check lint typecheck prisma-validate audit test smoke build check commit-check

install:
	npm ci
	npm run prisma:generate

hooks:
	git config core.hooksPath .githooks

format:
	npm run format

format-check:
	npm run format:check

lint:
	npm run lint

typecheck:
	npm run typecheck

prisma-validate:
	npm run prisma:validate

audit:
	npm run audit:modules

test:
	npm test

smoke:
	npm run test:smoke

build:
	npm run build

commit-check: format-check lint smoke

check: format-check lint typecheck prisma-validate audit test build
