// core/tokens/mika-alert.token.ts
import { InjectionToken } from '@angular/core';
import { MikaAlertRef } from '../schema';

export const MIKA_ACTION_ALERT = new InjectionToken<MikaAlertRef>('MIKA_ACTION_ALERT');
