import { EnvironmentProviders, importProvidersFrom, inject, Injector, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MIKA_APP_CONFIG } from './mika-form.tokens';
import { MikaFormService } from '../services/mika-form.service';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { provideTranslateService } from '@ngx-translate/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../providers/custom-paginator-intl';
import { LIB_I18N_PATH, MIKA_INJECTOR } from '../tokens/mika.tokens';
import { initializeHttpInterceptors, mikaAppInitializer, mikaDefaultTranslateService, resolveMikaAppAsyncConfig, resolveRoutes } from './app-initializer';
import { MikaAppConfigAsyncOptions, MikaAppConfigOptions } from '../types/mika-app.type';
import { MikaAppConfig } from '../interfaces';

export function getMikaAppProviders(mikaAppConfig: MikaAppConfigOptions) {
	const path = (mikaAppConfig as MikaAppConfig)?.i18n?.i18nPath || null;
	console.log('i18n Path in Providers:', path);
	const providers: any = makeEnvironmentProviders([
		{ provide: MIKA_INJECTOR, useFactory: () => inject(Injector) },
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
		{ provide: MIKA_APP_CONFIG, useValue: mikaAppConfig},
		{ provide: LIB_I18N_PATH, useValue: path },
		MikaFormService,
		provideIonicAngular({ mode: 'md' }),
		provideRouter(resolveRoutes(mikaAppConfig), withPreloading(PreloadAllModules)),
		provideHttpClient(withInterceptors(initializeHttpInterceptors(mikaAppConfig))),
		provideTranslateService(mikaDefaultTranslateService()),
		importProvidersFrom(MatNativeDateModule),
		provideAppInitializer(() => mikaAppInitializer(inject(Injector))),
		// ...mikaComponentOverrideProviders(componentOverrides)
	]);
	return providers;
}

export async function provideMikaFormAsync(mikaAppConfigOptions: MikaAppConfigAsyncOptions): Promise<EnvironmentProviders> {
	const mikaAppConfig = await resolveMikaAppAsyncConfig(mikaAppConfigOptions);
	return getMikaAppProviders(mikaAppConfig);
}

export function provideMikaForm(mikaAppConfig: MikaAppConfigOptions): EnvironmentProviders {
	return getMikaAppProviders(mikaAppConfig);
}
