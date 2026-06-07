# App Config Reference

`MikaAppConfig` defines a single tenant/app. You pass one or more to `provideMikaCore()`.

## Full example

```typescript
import { MikaAppConfig } from '@mikaverse/core';

export function makeMyApp(): MikaAppConfig {
  return {
    appId: 'my-app',              // unique across all loaded apps
    baseUrls: {
      apiBaseUrl: 'https://api.example.com',
    },
    auth: {
      endpoints: {
        login: 'auth/login',
        logout: 'auth/logout',
      },
      requestMap: {
        identifierKey: 'username', // default
        passwordKey: 'password',   // default
      },
    },
    i18n: {
      defaultLang: 'en',
      fallbackLang: 'en',
      i18nPath: '/assets/i18n/',   // must end with /
    },
    settings: {
      siteName: 'My App',
      noAuth: false,               // set true to skip login for demos
      sidebarMode: 'auto',         // 'auto' | 'manual'
    },
    entities: {
      articles: articleConfig,
      tags: tagConfig,
    },
    customRoutes: [
      {
        path: 'about',
        loadComponent: () => import('./pages/about.page').then(m => m.AboutPage),
      },
    ],
    environments: [
      { id: 'prod', name: 'Production', production: true, apiBaseUrl: 'https://api.example.com', default: true },
      { id: 'dev',  name: 'Dev',        production: false, apiBaseUrl: 'http://localhost:3000' },
    ],
  };
}
```

## Multi-tenant bootstrap

```typescript
// app.config.ts
import { provideMikaCore } from '@mikaverse/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMikaCore([
      makeBlogApp(),
      makeStoreApp(),  // each app has its own API, entities, auth
    ]),
  ],
};
```

## noAuth bypass

Set `settings.noAuth: true` to skip the login screen entirely. The auth guard returns `true` without checking credentials. Useful for demos and development.

## customRoutes

Routes added here are mounted **inside** the Mika shell (sidebar + toolbar visible) but outside the engine's auto-generated CRUD routes. Use them for dashboards, about pages, settings screens, etc.

```typescript
customRoutes: [
  { path: 'analytics', loadComponent: () => import('./analytics.page').then(m => m.AnalyticsPage) },
]
```

## environments

Define multiple API environments (prod, staging, dev). The active environment is persisted and drives `apiBaseUrl` for all requests in that app. Switch at runtime via `MikaContextService.setEnvironment(id)`.

## i18n

See [i18n](i18n.md) for the full translation setup.

## settings reference

| Field | Type | Description |
|---|---|---|
| `siteName` | `string` | Display name shown in the toolbar and login page |
| `noAuth` | `boolean?` | Skip auth guard entirely |
| `sidebarMode` | `'auto'\|'manual'?` | `'auto'` builds the sidebar from entity `sidebarConfig`; `'manual'` uses `sidebarGroups` |
| `sidebarGroups` | array? | Manual sidebar group definitions |
| `enableAuditLogs` | `boolean?` | Enable per-entity audit logging (planned) |
