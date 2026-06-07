# Getting Started

Get a fully functional Mika admin panel running in under 5 minutes.

## Prerequisites

- Node.js 20+
- npm 10+

## 1. Clone and install

```bash
git clone https://github.com/mikaverseio/mika.git
cd mika
npm install
```

## 2. Start the mock APIs

Mika ships with two pre-configured demo apps:

| Command | Port | Data |
|---|---|---|
| `npm run api:demo1` | 3000 | Mika Store (books + orders) |
| `npm run api:demo2` | 3001 | Mika Blog (posts + categories) |

To run both simultaneously:

```bash
npm run api:all
```

## 3. Start the demo app

```bash
npx nx serve demo-material
```

Open [http://localhost:4200](http://localhost:4200).

You'll see the Mika Blog app by default. Use the **app switcher** in the toolbar to switch to Mika Store.

## Shortcut: blog in one command

```bash
npm run dev:blog    # starts api:demo2 + demo-material in parallel
npm run dev:all     # starts both APIs + demo-material
```

## What you'll see

- **Posts** — full CRUD with table (sort/filter/paginate), form with grouped fields, hooks
- **Categories** — a second entity demonstrating relational lookups
- **Mika Store** — switch apps via the toolbar; shows books + orders on a separate API
- **About page** — a custom non-CRUD route added via `customRoutes`

## Next steps

- [Entity Config reference](entity-config.md) — understand every config option
- [App Config reference](app-config.md) — multi-tenant, auth, i18n, custom routes
- [Field Types](field-types.md) — all 25+ field types with examples
