# Entity Config Reference

`MikaEntityConfig` is the central config object. One object = one complete CRUD resource.

## Minimal example

```typescript
import { MikaEntityConfig } from '@mikaverse/core';

export const articleConfig: MikaEntityConfig = {
  contentType: 'articles',
  endpoints: { base: 'articles' },
  singular: 'article',
  table: {
    columns: [
      { key: 'title', label: 'Title', sortable: true },
      { key: 'status', label: 'Status' },
    ],
  },
  form: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ]},
    ],
  },
};
```

## Top-level fields

| Field | Type | Description |
|---|---|---|
| `contentType` | `string` | Unique key used as route slug (e.g. `'posts'`) |
| `singular` | `string` | Human label for a single item (`'post'`) |
| `endpoints.base` | `string` | API endpoint prefix (`'posts'`) |
| `endpoints.get` | `string?` | Override GET list endpoint |
| `endpoints.create` | `string?` | Override POST endpoint |
| `endpoints.update` | `string?` | Override PUT/PATCH endpoint |
| `endpoints.delete` | `string?` | Override DELETE endpoint |
| `localizable` | `boolean?` | Enable field-level localization |
| `actions.items` | object | Enable `create`, `edit`, `delete`, `search` |
| `permissions.requiredClaims` | object | Map `EMikaAction` → permission string |
| `sidebarConfig` | object | `{ sidebarGroup, order, icon }` |
| `response.props` | object | Override `{ data, total }` response keys |
| `request.allResultsParam` | `string?` | Query param to fetch all rows for export |

## table config

```typescript
table: {
  sortable: true,           // enable sort globally
  filters: [               // filter bar
    {
      key: 'status',
      label: 'Status',
      type: 'select',      // 'text' | 'select' | 'date'
      options: [...]
    },
    {
      key: 'category',
      type: 'select',
      optionsSource: 'categories', // relational lookup
      localizeKey: 'name'
    }
  ],
  columns: [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      localizable: true,   // render localized value
      renderType: 'text',  // 'text'|'image'|'chip'|'date'|'boolean'
      format: 'mediumDate' // Angular DatePipe format (renderType:'date')
    }
  ]
}
```

## form config

```typescript
form: {
  fields: [
    {
      key: 'title',
      label: 'Post Title',
      group: 'General',       // visual group / tab
      type: 'text',
      localizable: true,
      validators: [Validators.required],
      defaultValue: '',
      optionsSource: 'categories', // for select/radio
    }
  ]
}
```

See [Field Types](field-types.md) for the complete list of `type` values.

## Hooks

Hooks run during the form submit lifecycle. They live directly on `MikaEntityConfig`.

```typescript
export const postConfig: MikaEntityConfig = {
  // ...

  onSubmitTransform: (formData, context) => {
    // Mutate or replace formData before it's sent to the API
    if (!formData.slug) {
      formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-');
    }
    return formData;
  },

  onSuccess: (response, context) => {
    console.log('Saved:', response);
  },

  onError: (error, context) => {
    console.error('Save failed:', error);
  },
};
```

See [Hooks](hooks.md) for the full hook API.

## Permissions

```typescript
import { EMikaAction } from '@mikaverse/core';

permissions: {
  requiredClaims: {
    [EMikaAction.DELETE]: 'blog:delete_post',
    [EMikaAction.SHOW]:   'blog:view_list',
    [EMikaAction.APPROVE]: 'cms:review_content',
  }
}
```

See [Permissions](permissions.md) for setup.
