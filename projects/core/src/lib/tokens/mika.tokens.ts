import { InjectionToken, Injector, Type } from "@angular/core";

export const MIKA_INJECTOR = new InjectionToken<Injector>('MikaRootInjector');

// export const MIKA_FIELD_COMPONENT_OVERRIDES = new InjectionToken<Record<string, Type<any>>>('MIKA_FIELD_COMPONENT_OVERRIDES');

export const MIKA_FIELD_COMPONENT_OVERRIDES = new InjectionToken<Record<string, Type<any>>>(
	'MIKA_FIELD_COMPONENT_OVERRIDES'
);

export const LIB_I18N_PATH = new InjectionToken<string>('LIB_I18N_PATH');
