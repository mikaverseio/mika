import { EnvironmentProviders, inject, Injector, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { MikaEngineService } from '../services/engine/mika-engine.service';
import { LIB_I18N_PATH, MIKA_APP_CONFIG, MIKA_INJECTOR } from '../tokens/mika.tokens';
import { mikaAppInitializer, resolveMikaAppAsyncConfig } from './mika-initializer';
import { MikaAppConfig, MikaAppConfigAsyncOptions, MikaAppConfigOptions } from '../schema';



/**
 * Internal factory to generate the provider set.
 */
export function getMikaProviders(mikaAppConfig: MikaAppConfigOptions) {
	const path = (mikaAppConfig as MikaAppConfig)?.i18n?.i18nPath || null;

	const providers: any = makeEnvironmentProviders([
		// 1. Core Infrastructure
		{ provide: MIKA_INJECTOR, useFactory: () => inject(Injector) },
		{ provide: MIKA_APP_CONFIG, useValue: mikaAppConfig},
		{ provide: LIB_I18N_PATH, useValue: path },

		// 2. The Engine Service (Singleton)
		MikaEngineService,

		// 3. Bootstrapper
		provideAppInitializer(() => mikaAppInitializer(inject(Injector))),
	]);
	return providers;
}

export async function provideMikaAsync(mikaAppConfigOptions: MikaAppConfigAsyncOptions): Promise<EnvironmentProviders> {
	const mikaAppConfig = await resolveMikaAppAsyncConfig(mikaAppConfigOptions);
	return getMikaProviders(mikaAppConfig);
}

export function provideMika(mikaAppConfig: MikaAppConfigOptions): EnvironmentProviders {
	return getMikaProviders(mikaAppConfig);
}
