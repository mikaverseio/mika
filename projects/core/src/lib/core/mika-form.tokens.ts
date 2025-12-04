import { InjectionToken } from '@angular/core';
import { MikaFormConfig } from '../interfaces/form/mika-form-config.interface';
import { MikaAppConfig } from '../interfaces/core/mika-app-config.interface';
import { MikaAppConfigOptions } from '../types/mika-app.type';

export const MIKA_APP_CONFIG = new InjectionToken<MikaAppConfigOptions>('MIKA_APP_CONFIG');
