# Permissions

Mika's permission system uses claim-based access control. Each action on an entity can
require a specific claim string. The current user's claims come from the login response.

## How it works

1. On login, the API response includes a `permissions` array (or the field you map)
2. `MikaAuthService` stores these claims in a signal
3. `hasPermission(claim)` returns `true` if the user has that claim, or if no claim is required
4. UI elements (delete buttons, create buttons) are conditionally shown based on `hasPermission`

## Configure claims on an entity

```typescript
import { MikaEntityConfig, EMikaAction } from '@mikaverse/core';

export const postConfig: MikaEntityConfig = {
  // ...
  permissions: {
    requiredClaims: {
      [EMikaAction.DELETE]: 'blog:delete_post',
      [EMikaAction.SHOW]:   'blog:view_list',
      [EMikaAction.APPROVE]: 'cms:review_content',
      [EMikaAction.CREATE]: 'blog:create_post',
      [EMikaAction.EDIT]:   'blog:edit_post',
    }
  }
};
```

If `requiredClaims` is not set for an action, that action is allowed for all authenticated users.

## Available actions (`EMikaAction`)

| Action | When checked |
|---|---|
| `SHOW` | Viewing the entity list |
| `CREATE` | Showing the create button / accessing the create route |
| `EDIT` | Showing the edit button / accessing the edit route |
| `DELETE` | Showing the delete button / executing delete |
| `APPROVE` | Showing approve/publish actions |
| `EXPORT` | Print/export modal access |

## Login response mapping

By default, Mika reads `permissions` from the login response root. Configure a custom path
via `MikaAppConfig.auth.permissionsKey`:

```typescript
auth: {
  permissionsKey: 'user.roles',  // dot-path into login response
}
```

## Global permission fallback

`MikaAuthService.hasPermission()` behavior:
- If `permission` argument is `undefined` → returns `true` (no restriction)
- If user has a populated permissions array → checks inclusion
- If user has no permissions array → returns `true` (fallback: allow all)

This means permission enforcement is **opt-in per entity action**. Deploying without
`requiredClaims` is safe — all actions are accessible to authenticated users.

## Demo

The demo app (`db-demo2.json`) has two users:

| Username | Password | Claims |
|---|---|---|
| `admin` | `admin123` | `blog:delete_post`, `blog:view_list`, `cms:review_content` |
| `editor` | `editor123` | `blog:view_list` |

The `editor` user can see the posts list but cannot delete or approve posts.
Since `noAuth: true` is set in the demo, login is bypassed — enable it to test RBAC.
