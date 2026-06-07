# Hooks

Hooks intercept the form submit lifecycle. They are defined directly on `MikaEntityConfig`
and called by the form engine at the appropriate stage.

## Hook API

All hooks receive `(data, context: MikaHookContext)`:

```typescript
interface MikaHookContext {
  config: MikaEntityConfig;
  form?: FormGroup;
  mode?: 'create' | 'edit';
  id?: number;
}
```

## Available hooks

### `onSubmitTransform`

Called **before** the API call. Use it to transform or enrich the form data.
The return value replaces the payload sent to the API.

```typescript
onSubmitTransform: (formData, context) => {
  // Auto-generate slug from title on create
  if (context.mode === 'create' && !formData.slug) {
    formData.slug = formData.title.toLowerCase().replace(/\s+/g, '-');
  }
  // Remove UI-only fields before sending
  delete formData._uiState;
  return formData;
},
```

### `onSubmit`

Called **instead of** the default API call. Use it to implement a completely custom
submit flow (e.g. multi-step save, optimistic updates).

```typescript
onSubmit: async (formData, context) => {
  await myCustomSaveService.save(formData);
},
```

### `onSuccess`

Called **after** a successful API response.

```typescript
onSuccess: (response, context) => {
  analytics.track('post_saved', { id: response.id, mode: context.mode });
},
```

### `onError`

Called when the API call fails.

```typescript
onError: (error, context) => {
  Sentry.captureException(error, { extra: { entity: context.config.contentType } });
},
```

### `submitHandler`

Full override of the submit mechanism. Gives you the raw `FormGroup` and full context.
Use only when the other hooks don't give you enough control.

```typescript
submitHandler: async (form, context) => {
  if (!form.valid) return;
  const data = form.value;
  // custom logic...
},
```

## Hook execution order

```
User clicks Save
  → form validation
  → onSubmitTransform (mutate/replace data)
  → onSubmit OR default API call
  → onSuccess / onError
```

If `onSubmit` is present, the default API call is **skipped** entirely.

## Example: slug auto-generation

```typescript
export const postConfig: MikaEntityConfig = {
  // ...
  onSubmitTransform: (formData) => {
    if (formData.title && !formData.slug) {
      formData.slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');
    }
    return formData;
  },
};
```
