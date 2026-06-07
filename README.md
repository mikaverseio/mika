# Mika — Config-Driven Angular Admin Engine

> Define a TypeScript config object. Get a full CRUD admin panel.

Mika is an open-source Angular library that turns entity configuration into a complete admin UI — tables with sorting/filtering/pagination, create/edit/view forms, delete with confirmation, multi-language support, and more. No boilerplate. Works with any REST API.

## What Mika Does

You write this:

```typescript
// posts.config.ts
export const postConfig: MikaEntityConfig = {
  contentType: 'posts',
  endpoints: { base: 'posts' },
  table: {
    sortable: true,
    columns: [
      { key: 'title', label: 'Title', sortable: true },
      { key: 'status', label: 'Status', renderType: 'chip' },
      { key: 'publishedAt', label: 'Published', renderType: 'date' }
    ]
  },
  form: {
    fields: [
      { key: 'title', label: 'Title', type: 'text', validators: [Validators.required] },
      { key: 'status', label: 'Status', type: 'select', options: [...] }
    ]
  },
  actions: { items: { edit: true, delete: true, create: true, search: true } }
}
```

You get: a fully functional list page, create form, edit form, delete confirmation, search, filters, and pagination — all wired to your REST API.

## Quick Start (5 minutes)

```bash
git clone https://github.com/mikaverseio/mika.git
cd mika
npm install

# Terminal 1: start the mock API (blog data on :3000)
npm run api:demo2

# Terminal 2: start the demo app
npx nx serve demo-material
```

Open http://localhost:4200 — a working Mika admin with posts and categories, backed by a mock JSON API.

## Bootstrap

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(getMikaUiMaterialRoutes()),
    provideHttpClient(withInterceptors([mikaAuthInterceptor])),
    provideMikaCore([myApp]),
    importProvidersFrom(TranslateModule.forRoot({ ... }))
  ]
};
```

```html
<!-- app.html — that's it -->
<mika-root-material></mika-root-material>
```

## Key Features

| Feature | Description |
|---|---|
| **Config-driven** | Define TypeScript configs, get full CRUD UI automatically |
| **API-agnostic** | Works with any REST API via configurable endpoints |
| **Multi-tenant** | Run multiple independent apps in one instance, switch with `?app=` |
| **i18n built-in** | Engine and app-level translations, RTL support, localizable fields |
| **Permission system** | Per-action `requiredClaims` on entity configs |
| **Hook system** | `onSubmit`, `onSubmitTransform`, `onSuccess`, `onError` callbacks |
| **Custom routing** | Inject non-CRUD pages via `customRoutes` in app config |
| **Custom fields** | Override any field type with your own component via DI token |
| **Export / Print** | Built-in table export and print modal |
| **25+ field types** | text, select, multiselect, date, autocomplete, richtext, file, and more |

## Architecture

```
@mikaverse/core          — headless engine: interfaces, services, guards, normalizers
@mikaverse/ui-material   — Angular Material UI implementation
@mikaverse/ui-ionic      — Ionic UI implementation (v0.2, coming soon)
```

The core engine has zero UI framework dependencies. UI packages depend on core, never the reverse.

## Packages

| Package | Version | Description |
|---|---|---|
| `@mikaverse/core` | 0.0.1-alpha | Headless engine |
| `@mikaverse/ui-material` | 0.0.1-alpha | Angular Material UI |

## Status

**v0.1-alpha** — The Material UI is fully functional. APIs may change before v1.0.

## Documentation

- [Getting Started](docs/getting-started.md)
- [Entity Config Reference](docs/entity-config.md)
- [App Config Reference](docs/app-config.md)
- [Field Types](docs/field-types.md)
- [Multi-Tenant](docs/multi-tenant.md)
- [Permissions](docs/permissions.md)
- [Hooks](docs/hooks.md)
- [Custom Routing](docs/custom-routing.md)
- [Custom Components](docs/custom-components.md)
- [i18n Guide](docs/i18n.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, mock API usage, how to add entity configs, and the PR process.

## License

MIT
