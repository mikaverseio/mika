# Field Types

Every field in `form.fields` has a `type` property that controls both the rendered input and validation behavior.

## Text inputs

| Type | Renders | Notes |
|---|---|---|
| `text` | `<input type="text">` | Default |
| `textarea` | `<textarea>` | Multi-line text |
| `email` | `<input type="email">` | Email validation hint |
| `password` | `<input type="password">` | Masked input |
| `number` | `<input type="number">` | Numeric keyboard |
| `url` | `<input type="url">` | URL format hint |
| `phone` | `<input type="tel">` | Phone keyboard |
| `search` | `<input type="search">` | With clear button |

## Rich content

| Type | Renders | Notes |
|---|---|---|
| `richtext` | Rich text editor | HTML output |
| `markdown` | Markdown editor | Plain text + preview |
| `code` | Code editor | With syntax highlighting |
| `json` | JSON editor | With validation |

## Selection

| Type | Renders | Notes |
|---|---|---|
| `select` | `<mat-select>` | Requires `options` or `optionsSource` |
| `multiselect` | `<mat-select multiple>` | Array output |
| `radio` | Radio group | Requires `options` |
| `checkbox` | Single checkbox | Boolean output |
| `toggle` | Slide toggle | Boolean output |
| `chips` | Chip input | Array of strings |
| `autocomplete` | Autocomplete | With remote search |

## Date/time

| Type | Renders | Notes |
|---|---|---|
| `date` | Date picker | ISO date string output |
| `datetime` | Date + time picker | ISO datetime output |
| `time` | Time picker | HH:MM string output |
| `daterange` | Date range picker | `{ start, end }` output |

## Media

| Type | Renders | Notes |
|---|---|---|
| `image` | Image URL input + preview | Stores URL string |
| `file` | File upload | Stores URL after upload |
| `gallery` | Multi-image upload | Array of URLs |
| `color` | Color picker | Hex color string |

## Relations

| Type | Renders | Notes |
|---|---|---|
| `relation` | `select` backed by API | Uses `optionsSource` to fetch related records |
| `polymorphic` | Type + ID pair | For polymorphic associations |

## Layout

| Type | Renders | Notes |
|---|---|---|
| `group` | Visual section header | No value, cosmetic only |
| `divider` | Horizontal rule | No value, cosmetic only |
| `hidden` | Not rendered | Passes value through without UI |
| `readonly` | Read-only display | Shows value, no input |

## Options configuration

For `select`, `multiselect`, `radio`:

```typescript
// Static options
{
  key: 'status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ]
}

// Relational lookup (fetches from another entity's endpoint)
{
  key: 'categoryId',
  type: 'select',
  optionsSource: 'categories',  // uses the 'categories' entity config
  localizeKey: 'name',          // which field to display as the option label
}
```

## Localization

Add `localizable: true` to store and display the field in the active language:

```typescript
{ key: 'title', type: 'text', localizable: true }
```

Mika stores localized values as `{ en: 'Hello', ar: 'مرحبا' }` and reads the correct
locale at render time.

See [i18n](i18n.md) for the full localization setup.
