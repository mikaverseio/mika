import { InjectionToken, Type } from '@angular/core';

// Maps widget `type` to an Angular component Type provided by UI layer.
export type MikaWidgetRegistry = Record<string, Type<any>>;

export const MIKA_WIDGET_REGISTRY = new InjectionToken<MikaWidgetRegistry>('MIKA_WIDGET_REGISTRY');
