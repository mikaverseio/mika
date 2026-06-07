# Multi-Tenant

Mika supports multiple independent apps running inside the same Angular application. Each app has its own API base URL, entity configs, auth credentials, and i18n settings.

## Define multiple apps

```typescript
// app.config.ts
provideMikaCore([
  makeBlogApp(),   // { appId: 'mika-blog', baseUrls: { apiBaseUrl: 'http://localhost:3001' } }
  makeStoreApp(),  // { appId: 'mika-store', baseUrls: { apiBaseUrl: 'http://localhost:3000' } }
])
```

## Switch apps at runtime

### Via URL parameter

Append `?app=<appId>` to any URL. `MikaContextService` reads this on startup:

```
http://localhost:4200?app=mika-store
```

### Via service

```typescript
import { MikaContextService } from '@mikaverse/core';

const context = inject(MikaContextService);
context.activateApp('mika-store');
```

### Via the built-in app switcher

When more than one app is loaded, `MikaRootMaterialComponent` renders a select dropdown
in the toolbar. Selecting an app calls `activateApp()` and reloads the entity list.

## How isolation works

Each app is isolated in `MikaContextService`:

- **API calls** use the active app's `baseUrls.apiBaseUrl`
- **Auth tokens** are stored per `appId` in `localStorage`
- **Entity configs** come from the active app's `entities` map
- **i18n** uses the active app's `i18n` config (separate translation files)
- **Sidebar** rebuilds from the active app's entity `sidebarConfig`

Switching apps triggers a full context reload — all signals update and the UI re-renders.

## Persistence

The last active `appId` is persisted in `localStorage` under the key `mika_active_app`.
On reload, Mika restores the saved app. The `?app=` URL param overrides this.

## App-specific environments

Each app can have its own environment list (prod, staging, dev):

```typescript
environments: [
  { id: 'prod', name: 'Production', production: true, apiBaseUrl: 'https://api.example.com', default: true },
  { id: 'local', name: 'Local', production: false, apiBaseUrl: 'http://localhost:3001' },
]
```

Switch environment via `MikaContextService.setEnvironment(id)`.
