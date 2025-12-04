import { inject, Injectable, signal } from '@angular/core';
import { MikaEntityConfig } from '../interfaces/entity/mika-entity-config.interface';
import { MikaDataService } from './mika-data.service';
import { MikaGlobalConfig } from '../interfaces/settings/mika-global-config.interface';
import { MikaPreloadConfig } from '../interfaces/entity/mika-preload-config.interface';
import { MikaApiService } from './http/mika-api.service';
import { Mika } from '../helpers/mika-app.helper';
import { firstValueFrom } from 'rxjs';
import { MikaFieldConfig } from '../interfaces/field/mika-field-config.interface';
import { MikaUrlHelper } from '../helpers/mika-endpoint.helper';
import { MikaAppService } from './mika-app.service';

@Injectable({ providedIn: 'root' })
export class MikaPreloadService {

	dataService = inject(MikaDataService);
	api = inject(MikaApiService);
	app = inject(MikaAppService);

	async handlePreload(settings: MikaGlobalConfig, entityConfigs: any) {
		if (settings && settings.preload?.length) {
			await this.preloadFromGlobal(settings.preload);
		}

		await this.preloadFromEntityConfigs(entityConfigs);
	}

	async load(key: string, options: MikaPreloadConfig | null, field?: MikaFieldConfig) {
		console.log('---------------------------');
		console.log('Loading preload for:', key, options);
		const config = await this.app.getConfig(key);
		console.log('Config:', config);
		const preloadConfig = Mika.getEntityPreloadConfig(options!, config, field);
		console.log('Preload Config:', preloadConfig);
		const res = await firstValueFrom(this.api.get(preloadConfig.endpoint!, preloadConfig.params ?? {}));
		console.log('Response:', res);
		// const res = await firstValueFrom(this.api.config(config).get())
		const finalData = options?.transform ? options.transform(res) : res;
		console.log('Final Data:', finalData);
		this.dataService.storeSignal(key, finalData);
		console.log('Data stored in service for key:', key);
		console.log('---------------------------');
	}

	async preloadFromGlobal(preload: MikaPreloadConfig[]) {
		await Promise.all(preload.map(cfg =>
			this.load(cfg.key, cfg)
		));
	}

	async preloadFromEntityConfigs(configs: Map<string, MikaEntityConfig | Function>) {
		const tasks: Promise<void>[] = [];

		console.log('Preloading from entity configs:', configs);

		if (!configs || configs.size === 0) {
			console.log('No entity configs provided for preloading.');
			return;
		}

		for (const [slug, configOrFn] of configs?.entries()) {
			const config = await this.app.getConfig(slug)
			const preload = config.preload;
			if (!preload) continue;

			const endpoint = typeof preload === 'object' && preload.endpoint
				? preload.endpoint
				: `${MikaUrlHelper.ensureBase(config.apiBaseUrl ?? '')}${config.endpoints?.get}/all`;

			const params = typeof preload === 'object' && preload.params
				? preload.params
				: { orderBy: 'order', sortOrder: 'asc', data: 1 };

			const transform = typeof preload === 'object' ? preload.transform : undefined;

			tasks.push(this.load(config.contentType, {
				key: config.contentType,
				endpoint,
				params,
				transform
			}));
		}

		await Promise.all(tasks);
	}
}
