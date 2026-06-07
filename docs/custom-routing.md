# Custom Routing

Mika's CRUD routes are generated automatically from your entity configs. Custom routes
let you add arbitrary pages — dashboards, about pages, settings — that live alongside
the engine-generated routes inside the same shell.

## Add a custom route

In your `MikaAppConfig`, set `customRoutes`:

```typescript
import { Routes } from '@angular/router';

export function makeMyApp(): MikaAppConfig {
  return {
    appId: 'my-app',
    // ...
    customRoutes: [
      {
        path: 'about',
        loadComponent: () => import('./pages/about.page').then(m => m.AboutPage),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics.page').then(m => m.AnalyticsPage),
      },
    ] as Routes,
  };
}
```

Navigate to `/about` or `/analytics` — the Mika shell (sidebar + toolbar) wraps the page.

## Custom route with auth guard

Custom routes inherit the parent auth guard by default. If you need route-level guards:

```typescript
customRoutes: [
  {
    path: 'admin-settings',
    loadComponent: () => import('./pages/settings.page').then(m => m.SettingsPage),
    canActivate: [SuperAdminGuard],
  },
],
```

## Adding to the sidebar

Custom routes are not automatically added to the sidebar. To add a sidebar entry, use
`data.sidebar` (if your sidebar service reads it) or add the item manually via
`settings.sidebarGroups`:

```typescript
settings: {
  sidebarMode: 'manual',
  sidebarGroups: [
    {
      label: 'Content',
      items: [
        { label: 'Posts', route: '/posts', icon: 'newspaper' },
        { label: 'About', route: '/about', icon: 'info' },
      ]
    }
  ]
}
```

## Demo example

The Mika Blog demo app includes an `/about` page added via `customRoutes`:

```typescript
// apps/demo-material/src/mika-apps/mika-blog/mika-blog.app.ts
customRoutes: [
  {
    path: 'about',
    loadComponent: () => import('./pages/about.page').then(m => m.AboutPage),
    data: { sidebar: { label: 'About', icon: 'info', order: 99 } }
  }
]
```
