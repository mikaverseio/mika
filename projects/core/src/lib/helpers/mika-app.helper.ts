// src/app/mika-form/core/mika.ts

import { Injector } from '@angular/core';
import { MikaEntityConfig } from '../interfaces/entity/mika-entity-config.interface';
import { MikaPreloadConfig } from '../interfaces/entity/preload-config.interface';
import { FormField } from '../interfaces/field/form-field.interface';
import { MikaGlobalSettings } from '../interfaces/settings/mika-global-settings.interface';
import { isUrl } from '../utils/utils';
import { MikaAppService } from '../services/mika-app.service';
import { MikaUrlHelper } from './mika-endpoint.helper';

export class Mika {

	public static settings: MikaGlobalSettings;

	static set(settings: MikaGlobalSettings) {
		this.settings = settings;
	}

	static get(): MikaGlobalSettings {
		if (!this.settings) {
			throw new Error('[MikaForm] Global settings have not been initialized.');
		}
		return this.settings;
	}

	static get apiBase() {
		return 'apiBase';
	}

	static get siteName() {
		return this.get().siteName;
	}

	static get logo() {
		return this.get().logo;
	}

	static get publicSite() {
		return this.get().publicSiteUrl;
	}

	static get mikaSettingsPage() {
		return '/mika/settings'
	}

	static get mikaHelpPage() {
		return '/mika/help'
	}

	static getSetting<T = any>(key: string, fallback?: T): T {
		return key.split('.').reduce((acc: any, part: string) => acc?.[part], this.settings) ?? fallback;
	}

	static getFullUrl(config: MikaEntityConfig, endpoint?: string, suffix: string = ''): string {
		const base = config.apiBaseUrl ?? this.apiBase;
		const url = `${MikaUrlHelper.ensureBase(base)}${endpoint ?? config.endpoints?.list}${suffix}`;
		return url;
		// return '';
	}

	static getEditEndpoint(config: MikaEntityConfig): string {
		// return config.editEndpoint
		// 	? config.editEndpoint.replace(':id', config.contentId?.toString() ?? '')
		// 	: `${config.endpoint}/${config.contentId}`;
		return '';
	}

	static getPostEndpoint(config: MikaEntityConfig): string {
		// return config.postEndpoint ?? config.endpoint;
		return '';
	}

	static getEntityPreloadConfig(preloadConfig: MikaPreloadConfig, config?: MikaEntityConfig | null, fieldConfig?: FormField) {

		if (preloadConfig && preloadConfig?.endpoint && isUrl(preloadConfig.endpoint)) {
			return {
				endpoint: preloadConfig.endpoint,
				params: preloadConfig.params ?? {}
			};
		}

		// const apiBase = MikaUrlHelper.ensureBase(config?.endpoints?.base ?? this.apiBase);

		let endpoint = preloadConfig?.endpoint ?? config?.endpoints?.get;
		let params = preloadConfig?.params ?? {
			orderBy: 'order',
			sortOrder: 'asc',
			data: 1,
			where: JSON.stringify({ active: 1 })
		};

		if (fieldConfig) {
			endpoint = fieldConfig.optionsEndpoint ?? config?.endpoints?.allResults ?? endpoint;
			params = fieldConfig.optionsQueryParams ?? config?.request?.allResultsParam ?? params;
		}

		// endpoint = `${apiBase}${endpoint}`;

		return { endpoint: endpoint, params };

	}
}


export namespace Mika {
	const _readyHooks: Array<(injector: Injector) => void | Promise<void>> = [];

	export function ready(fn: (injector: Injector) => void | Promise<void>) {
		_readyHooks.push(fn);
	}

	export async function runReadyHooks(injector: Injector) {
		for (const hook of _readyHooks) {
			await hook(injector);
		}
	}

	export function registerApp(config: Parameters<MikaAppService['registerApp']>[0]) {
		ready((injector) => {
			const app = injector.get(MikaAppService);
			app.registerApp(config);
		});
	}
}
