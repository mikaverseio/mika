# Contributing to Mika

## Local Setup

```bash
git clone https://github.com/mikaverseio/mika.git
cd mika
npm install
```

## Running the Demo

Mika ships with two mock API servers (powered by `json-server`) and a demo Angular app.

**Blog demo** (posts + categories):
```bash
npm run api:demo2        # starts json-server on :3000 with db-demo2.json
npx nx serve demo-material
```

**Store demo** (books + orders):
```bash
npm run api:demo1        # starts json-server on :3001 with db-demo1.json
```

Open http://localhost:4200. Both apps can run simultaneously — switch using the toolbar app selector or `?app=mika-store` in the URL.

## Project Structure

```
libs/core/           @mikaverse/core — headless engine (no UI deps)
libs/ui-material/    @mikaverse/ui-material — Angular Material UI
libs/ui-i18n/        @mikaverse/ui-i18n — i18n utilities (v0.2)
libs/ui-ionic/       @mikaverse/ui-ionic — Ionic UI (v0.2)
apps/demo-material/  Demo app using @mikaverse/ui-material
apps/shop/           Separate Angular SSR example (not a Mika app)
tools/mock-api/      json-server databases for local dev
```

## Adding an Entity Config

1. Create `my-entity.config.ts` in your app's `mika-apps/` folder:

```typescript
export const myEntityConfig: MikaEntityConfig = {
  contentType: 'my-entities',
  endpoints: { base: 'my-entities' },
  table: {
    columns: [
      { key: 'name', label: 'Name', sortable: true }
    ]
  },
  form: {
    fields: [
      { key: 'name', label: 'Name', type: 'text', validators: [Validators.required] }
    ]
  },
  actions: { items: { edit: true, delete: true, create: true } }
}
```

2. Register it in your app factory:

```typescript
export function makeMyApp(): MikaAppConfig {
  return {
    appId: 'my-app',
    baseUrls: { apiBaseUrl: 'http://localhost:3000' },
    settings: { siteName: 'My App' },
    entities: { 'my-entities': myEntityConfig }
  }
}
```

3. Add sample data to the mock API database (`tools/mock-api/db-demo1.json`):

```json
{
  "my-entities": [
    { "id": 1, "name": "Example" }
  ]
}
```

## Running Tasks

Use `nx` for all tasks — never the underlying tooling directly.

```bash
npx nx build core                    # build @mikaverse/core
npx nx build ui-material             # build @mikaverse/ui-material
npx nx test core                     # run core unit tests
npx nx lint --all                    # lint all projects
npx nx run-many -t build --all       # build everything
npx nx graph                         # visualize project dependencies
```

## Local Package Testing

A local Verdaccio registry is included for testing published packages:

```bash
npm run registry:start               # start Verdaccio on :4873
npx nx run core:publish              # publish @mikaverse/core to local registry
```

## Code Style

- No comments unless the **why** is non-obvious
- No `any` in public API surfaces — use proper TypeScript types
- Standalone Angular components only — no NgModules
- Signals for reactive state, not BehaviorSubject (except where RxJS interop is required)
- `ChangeDetectionStrategy.OnPush` on all components

## Pull Request Process

1. Fork and create a feature branch from `main`
2. Run `npx nx affected -t lint test build` before submitting
3. Keep PRs focused — one feature or fix per PR
4. Reference the relevant issue in the PR description

## Reporting Issues

Use [GitHub Issues](https://github.com/mikaverseio/mika/issues). Include the Angular and Mika versions, a minimal reproduction, and the expected vs actual behavior.
