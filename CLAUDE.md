# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

K-Drop is a React Native/Expo mobile app for KPOP fans featuring quiz functionality. Users can answer quizzes, create questions, and track their "ota-ryoku" (fan power) through rankings and history.

## Essential Commands

### Development

- `npm start` - Start Expo dev server
- `npx supabase start` - Start local Supabase instance (http://localhost:54323)
- `npx supabase stop --no-backup` - Stop local Supabase

### Testing & Quality

- `npm test` - Run Jest tests
- `npm run test:types` or `npx tsc --noEmit` - TypeScript type checking
- `npm run lint` or `npx eslint . --fix` - ESLint with auto-fix
- `npm run format` - Prettier formatting
- `npm run check:all` - Run all checks (tests, types, lint, format)

### Database

- `npm run gen-types` - Generate TypeScript types from Supabase schema

## Architecture Principles

### File Structure

- **File-based routing** with Expo Router (`app/` directory)
- **Feature-based organization** (`features/answer-quiz/`)
- **Separation of concerns**: Components in `/components/`, feature-specific in feature folders
- **Test files** alongside components in `__tests__` folders

### State Management Pattern

Follow the separation of concerns pattern:

```
Components → Custom Hooks → Context (UI State) + Utils (Pure Functions) → Repository (Data Access)
```

1. **Repository Layer** (`/repositories/`): Supabase data access
2. **Utils Layer** (`/utils/`): Pure business logic functions
3. **Context Layer** (`/context/`): UI state management only
4. **Custom Hooks** (`/hooks/`): Combine the above layers for component use

### Key Guidelines

- **UI State in Context**: Current selections, modal states, session info
- **Business Logic in Utils**: Calculations, filtering, validation
- **Data Access in Repository**: Supabase queries, API calls
- **Use React Query** for server state management
- **Test pure functions** separately from React components

### Testing Approach

- Unit tests with Jest and React Testing Library
- Mock Supabase client for data layer tests
- Test business logic as pure functions
- Use test utilities from `__tests__/testUtils.tsx`

## Environment Setup

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Code Style

- TypeScript with strict mode
- Path aliases configured (`@/*`)
- NO comments in code unless explicitly requested
- Follow existing patterns in the codebase
