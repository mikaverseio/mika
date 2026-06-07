# @mikaverse/core

The headless engine behind the Mika config-driven Angular admin framework.

## What's in this package

- **Interfaces** — `MikaAppConfig`, `MikaEntityConfig`, `MikaFieldConfig`, `MikaColumnConfig`, and all related types
- **Services** — context management, auth, HTTP, data, preload, hooks, grid state, i18n, logging
- **Guards** — `MikaAuthGuard`, `MikaEntityGuard`, `MikaFormGuard`, `TenantGuard`
- **Normalizers** — converts user-provided configs into a normalized internal shape
- **Tokens** — `MIKA_UI_PORT`, `MIKA_APP_CONFIG`, `MIKA_FIELD_COMPONENT_OVERRIDES`
- **Utilities** — `convertToFormData`, `slugify`, `printHtml`, `HybridLoader` (i18n)

## Key design constraint

This package has **zero dependencies** on Angular Material, Ionic, or any other UI framework. It depends only on `@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, `@ngx-translate/core`, and `rxjs`.

UI packages (`@mikaverse/ui-material`, `@mikaverse/ui-ionic`) depend on core — never the reverse.

## Usage

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideMikaCore([myAppConfig]),
    // ... UI package providers
  ]
}
```

## MikaUiPort

UI packages implement the `MikaUiPort` interface (injected via `MIKA_UI_PORT` token) to provide confirm dialogs, toast notifications, and loading indicators. Core services call this interface without knowing which UI framework is active.

```typescript
export interface MikaUiPort {
  confirm(options: MikaConfirmOptions): Promise<{ role?: string }>;
  showLoading(message?: string): void;
  hideLoading(): void;
  toastSuccess(message: string): void;
  toastError(message: string): void;
}
```

## Building

```bash
npx nx build core
```

## Testing

```bash
npx nx test core
```

## Part of the Mika monorepo

See the [root README](../../README.md) for the full architecture overview.
