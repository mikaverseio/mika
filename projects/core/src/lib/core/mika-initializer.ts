import { inject, Injector, Optional, runInInjectionContext, Type } from "@angular/core";
import { MikaAuthService } from "../services/auth/mika-auth.service";
import { MikaEngineService } from "../services/mika-engine.service";
import { Mika } from "../helpers/mika-app.helper";
import { TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { DynamicFieldComponentResolver } from "../resolvers/dynamic-field-component.resolver";
import { LIB_I18N_PATH, MIKA_APP_CONFIG, MIKA_FIELD_COMPONENT_OVERRIDES } from "../tokens/mika.tokens";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { MikaAppConfig } from "../interfaces/core/mika-app-config.interface";
import { mikaAuthInterceptor } from "../interceptors/mika-auth.interceptor";
import { MikaAppConfigAsyncOptions, MikaAppConfigOptions } from "../types/mika-app.type";
import { normalizeInterceptors } from "../normalizers/generic.normalization";
import { Routes } from "@angular/router";
import { mikaRoutes } from "../routes/mika.routes";
import { HybridLoader } from "../i18n/i18n-loader";

export function HttpLoaderFactory(http: HttpClient) {
	const baseUrl = new URL('./assets/i18n/', import.meta.url).href;
	console.log('i18n base url:', baseUrl);
	return new TranslateHttpLoader(http, baseUrl, ".json");
}

export const mikaAppInitializer = (parentInjector: Injector) => {
	return runInInjectionContext(parentInjector, async () => {
		const auth = inject(MikaAuthService);
		const mikaFormService = inject(MikaEngineService);
		const mikaSettings = inject(MIKA_APP_CONFIG);
		const ms: any = mikaSettings;
		mikaFormService.register(ms);
		await Mika.runReadyHooks(parentInjector);
		return auth.initialize();
	});
}

export const mikaDefaultTranslateService = () => {
	return {
		defaultLanguage: 'ar',
		loader: {
			provide: TranslateLoader,
			// useFactory: HttpLoaderFactory,
			useClass: HybridLoader,
			deps: [HttpClient, [new Optional(), LIB_I18N_PATH]]
		},
		isolate: true
	}
}

export const mikaComponentOverrideProviders = (overrides?: Record<string, Type<any>>) => {
	return [
		DynamicFieldComponentResolver,
		...(overrides
			? [
				{
					provide: MIKA_FIELD_COMPONENT_OVERRIDES,
					useValue: overrides,
					multi: true,
				},
			]
			: []),
	];
}

export const initializeHttpInterceptors = (mikaFormConfig: MikaAppConfig | MikaAppConfig[]) => {
	const apps = Array.isArray(mikaFormConfig) ? mikaFormConfig : [mikaFormConfig];

	const allInterceptors = apps
		.flatMap(app => normalizeInterceptors(app.interceptors))
		.filter(Boolean);

	const finalInterceptors = [
		mikaAuthInterceptor,
		...allInterceptors
	];

	return finalInterceptors;
}

export async function resolveMikaAppAsyncConfig(input: MikaAppConfigAsyncOptions): Promise<MikaAppConfig[]> {
	if (typeof input === 'function') {
		const result = await input();
		return normalizeMikaAppConfig(result);
	}
	if (typeof input === 'string') {
		const res = await fetch(input);
		if (!res.ok) throw new Error(`[MikaForm] Failed to load config from URL: ${input}`);
		const result = await res.json();
		return normalizeMikaAppConfig(result);
	}
	return normalizeMikaAppConfig(input);
}

export function resolveRoutes(input: MikaAppConfigOptions): Routes {
	const configs = normalizeMikaAppConfig(input);
	const mergedRoutes: Routes = [
		...extractCustomRoutes(configs),
		...mikaRoutes,
	];

	return mergedRoutes
}

export function normalizeMikaAppConfig(config: MikaAppConfigOptions): MikaAppConfig[] {
	return Array.isArray(config) ? config : [config];
}

export function extractCustomRoutes(configs: MikaAppConfig[]): Routes {
	return configs.flatMap(c =>
		Array.isArray(c.customRoutes) ? c.customRoutes : []
	);
}
