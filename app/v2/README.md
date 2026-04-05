# K-Drop v2

Vite + React + TypeScript project for `app/v2`.

## Setup

`app/v2` is pinned to `Node.js 24.14.1` via [`.nvmrc`](./.nvmrc), and `package.json#engines` is locked to the 24.x LTS line (`^24.14.1`).

1. Switch to the recommended Node.js runtime.
   - `nvm install 24.14.1`
   - `nvm use`
2. Provision the pinned pnpm toolchain from the active Node.js 24 shell.
   - `corepack enable`
   - `corepack prepare pnpm@10.33.0 --activate`
3. Verify that pnpm is attached to the same runtime.
   - `pnpm exec node -v`
   - Expected: `v24.14.1` or newer within the 24.x line
4. Install dependencies with `pnpm install`.
5. If you are switching from another Node.js major with an existing `node_modules`, run `pnpm run rebuild:native` once before running tests or CI.

`pnpm install` and the main `pnpm run ...` commands fail fast when the active Node.js version is outside the supported 24.x LTS range. If `pnpm exec node -v` still points at an older runtime after the steps above, check `command -v pnpm` and make sure it resolves from the same Node.js 24 toolchain you activated with `nvm use`. If it does not, refresh the shell or re-run `nvm use` before continuing.

## Scripts

- `pnpm run dev` — start the Vite dev server
- `pnpm run build` — type-check and create a production build
- `pnpm run test` — run Vitest once
- `pnpm run test:watch` — run Vitest in watch mode
- `pnpm run rebuild:native` — rebuild native test dependencies after switching Node.js majors
- `pnpm run test:types` — run TypeScript project type-checking
- `pnpm run lint` — run ESLint
- `pnpm run format` — format files with Biome
- `pnpm run format:check` — check Biome formatting
- `pnpm run check:all` — run test, typecheck, lint, format checks, and build

## Tooling

- React 19
- TypeScript strict mode
- `@/*` path alias
- ESLint configuration based on `app/v1/.eslintrc.js`
- Biome formatter with `lineWidth: 150`
- Vitest test runner
- pnpm (enforced via `preinstall`)
