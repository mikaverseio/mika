import { EnvironmentProviders, importProvidersFrom, inject, Injector, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MikaEngineService } from '../services/engine/mika-engine.service';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideTranslateService } from '@ngx-translate/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../providers/custom-paginator-intl';
import { LIB_I18N_PATH, MIKA_APP_CONFIG, MIKA_INJECTOR } from '../tokens/mika.tokens';
import { initializeHttpInterceptors, mikaAppInitializer, mikaDefaultTranslateService, resolveMikaAppAsyncConfig, resolveRoutes } from './mika-initializer';
import { MikaAppConfigAsyncOptions, MikaAppConfigOptions } from '../types/mika-app.type';
import { MikaAppConfig } from '../interfaces';


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

		// 3. Framework Integrations
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },

		provideIonicAngular({ mode: 'md' }),
		provideRouter(resolveRoutes(mikaAppConfig), withPreloading(PreloadAllModules)),
		provideHttpClient(withInterceptors(initializeHttpInterceptors(mikaAppConfig))),
		provideTranslateService(mikaDefaultTranslateService()),
		importProvidersFrom(MatNativeDateModule),

		// 4. Bootstrapper
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
