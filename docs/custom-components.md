# Custom Components

You can override any field renderer with your own Angular component. This lets you
embed domain-specific UI (rich text editors, map pickers, custom upload widgets) inside
Mika's generated forms without touching the engine.

## Inject a custom field component

Provide a map of `fieldType → component` via the `MIKA_FIELD_COMPONENT_OVERRIDES` token:

```typescript
// app.config.ts
import { MIKA_FIELD_COMPONENT_OVERRIDES } from '@mikaverse/ui-material';
import { MyRichTextComponent } from './fields/my-rich-text.component';
import { MyMapPickerComponent } from './fields/my-map-picker.component';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    {
      provide: MIKA_FIELD_COMPONENT_OVERRIDES,
      useValue: {
        richtext: MyRichTextComponent,
        map: MyMapPickerComponent,
      },
    },
  ],
};
```

When the form engine encounters a field with `type: 'richtext'` or `type: 'map'`, it
renders your component instead of the default.

## Component contract

Your component must implement the `MikaFieldComponent` interface:

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MikaFieldConfig } from '@mikaverse/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'my-rich-text',
  standalone: true,
  template: `...`,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MyRichTextComponent, multi: true }
  ]
})
export class MyRichTextComponent implements ControlValueAccessor {
  @Input() field!: MikaFieldConfig;

  // Implement ControlValueAccessor to integrate with Angular reactive forms
  writeValue(value: any) { ... }
  registerOnChange(fn: any) { ... }
  registerOnTouched(fn: any) { ... }
}
```

The component is wrapped in a standard `mat-form-field` by the form builder, so you
only need to provide the input logic.

## Override built-in types

You can also override built-in field types. This is useful for replacing the default
`text` input with your own styled version:

```typescript
{
  provide: MIKA_FIELD_COMPONENT_OVERRIDES,
  useValue: {
    text: MyStyledTextInputComponent,
  },
}
```
