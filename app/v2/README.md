# K-Drop v2

Vite + React + TypeScript project for `app/v2`.

## Setup

`app/v2` is pinned to `Node.js 24.14.1` via [`.nvmrc`](./.nvmrc), and `package.json#engines` is locked to the 24.x LTS line (`^24.14.1`).

1. Switch to the recommended Node.js runtime.
   - `nvm install 24.14.1`
   - `nvm use`
2. Use the pinned pnpm version through Corepack if your global `pnpm` is not already aligned.
   - `corepack enable`
3. Install dependencies with `corepack pnpm install`.
4. If you are switching from another Node.js major with an existing `node_modules`, run `corepack pnpm run rebuild:native` once before running tests or CI.

`pnpm install` and the main `pnpm run ...` commands fail fast when the active Node.js version is outside the supported 24.x LTS range. Run app/v2 commands through `corepack pnpm ...` when your global `pnpm` is managed by another toolchain.

## Scripts

- `corepack pnpm run dev` — start the Vite dev server
- `corepack pnpm run build` — type-check and create a production build
- `corepack pnpm run test` — run Vitest once
- `corepack pnpm run test:watch` — run Vitest in watch mode
- `corepack pnpm run rebuild:native` — rebuild native test dependencies after switching Node.js majors
- `corepack pnpm run test:types` — run TypeScript project type-checking
- `corepack pnpm run lint` — run ESLint
- `corepack pnpm run format` — format files with Biome
- `corepack pnpm run format:check` — check Biome formatting
- `corepack pnpm run check:all` — run test, typecheck, lint, format checks, and build

## Tooling

- React 19
- TypeScript strict mode
- `@/*` path alias
- ESLint configuration based on `app/v1/.eslintrc.js`
- Biome formatter with `lineWidth: 150`
- Vitest test runner
- pnpm (enforced via `preinstall`)
