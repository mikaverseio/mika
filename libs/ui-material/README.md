# @mikaverse/ui-material

Angular Material UI implementation for the Mika admin engine.

## What's in this package

- **Shell** — `MikaRootMaterialComponent` (sidenav + toolbar + router outlet)
- **Pages** — Dashboard, EntityList, EntityCreate, EntityEdit, EntityView, NotFound
- **Table** — `MikaTableComponent` with sorting, filtering, pagination, bulk actions, image/chip/date rendering
- **Form** — `MikaFormComponent` with field groups, 11+ field types, localization tabs
- **Field components** — text, textarea, select, multiselect, date, number, toggle, autocomplete, richtext, file
- **Export/Print** — `MikaPrintExportModalComponent` with column selection
- **Services** — `MikaFormBuilderService`, `MikaFormContextService`, `MikaSidebarService`, `MikaThemeService`
- **Routes** — `getMikaUiMaterialRoutes()` for the Angular router
- **Providers** — `provideUiMaterial()` for Material-specific DI wiring

## Peer dependencies

- Angular 21+
- Angular Material 17+
- `@mikaverse/core`
- `@ngx-translate/core`

## Usage

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(getMikaUiMaterialRoutes()),
    provideHttpClient(withInterceptors([mikaAuthInterceptor])),
    provideMikaCore([myAppConfig]),
    provideUiMaterial(),
    importProvidersFrom(TranslateModule.forRoot({ ... }))
  ]
}
```

```html
<!-- app.html -->
<mika-root-material></mika-root-material>
```

## Building

```bash
npx nx build ui-material
```

## Part of the Mika monorepo

See the [root README](../../README.md) for the full architecture overview.
