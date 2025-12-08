# luma-web

SvelteKit application managed by Nx. All npm scripts remain available, but the preferred workflow is through `nx run` so you take advantage of caching, task orchestration, and consistent CI behaviour.

## Install

```sh
npm install
```

## Common targets

```sh
# development server (no caching)
nx run luma-web:dev

# production build (cached)
nx run luma-web:build

# preview the built app (depends on :build)
nx run luma-web:preview

# quality gates
nx run luma-web:lint
nx run luma-web:typecheck
nx run luma-web:test      # runs unit + e2e suites
nx run luma-web:test-unit
nx run luma-web:test-e2e

# formatting utilities
nx run luma-web:format
```

Every cached target writes its artifacts under `apps/luma-web` (for example `build/` and `.svelte-kit/`). During local development you can inspect the cache status with `NX_VERBOSE_LOGGING=true nx run luma-web:build` or by visiting the Nx Cloud UI if your workspace is connected.
