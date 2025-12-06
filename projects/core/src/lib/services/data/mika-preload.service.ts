import { inject, Injectable, signal } from '@angular/core';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { MikaDataService } from './mika-data.service';
import { MikaGlobalConfig } from '../../interfaces/settings/mika-global-config.interface';
import { MikaPreloadConfig } from '../../interfaces/entity/mika-preload-config.interface';
import { MikaApiService } from '../http/mika-api.service';
import { Mika } from '../../helpers/mika-app.helper';
import { firstValueFrom } from 'rxjs';
import { MikaFieldConfig } from '../../interfaces/field/mika-field-config.interface';
import { MikaUrlHelper } from '../../helpers/mika-endpoint.helper';
import { MikaContextService } from '../engine/mika-context.service';
import { MikaLoggerService } from '../infra/mika-logger.service';
import { MikaConfigService } from '../engine/mika-config.service';

@Injectable({ providedIn: 'root' })
export class MikaPreloadService {

	dataService = inject(MikaDataService);
	api = inject(MikaApiService);
	app = inject(MikaContextService);
	config = inject(MikaConfigService);
	logger = inject(MikaLoggerService);

	async handlePreload(settings: MikaGlobalConfig, entityConfigs: any) {
		if (settings && settings.preload?.length) {
			await this.preloadFromGlobal(settings.preload);
		}

		await this.preloadFromEntityConfigs(entityConfigs);
	}

	async load(key: string, options: MikaPreloadConfig | null, field?: MikaFieldConfig) {

		const config = await this.config.getConfig(key);

		const preloadConfig = Mika.getEntityPreloadConfig(options!, config, field);

		const res = await firstValueFrom(this.api.get(preloadConfig.endpoint!, preloadConfig.params ?? {}));

		const finalData = options?.transform ? options.transform(res) : res;

		this.dataService.storeSignal(key, finalData);
	}

	async preloadFromGlobal(preload: MikaPreloadConfig[]) {
		await Promise.all(preload.map(cfg =>
			this.load(cfg.key, cfg)
		));
	}

	async preloadFromEntityConfigs(configs: Map<string, MikaEntityConfig | Function>) {
		const tasks: Promise<void>[] = [];

		if (!configs || configs.size === 0) {
			this.logger.info('MikaPreloadService', 'No entity configs provided for preloading.');
			return;
		}

		this.logger.info('MikaPreloadService', 'Preloading from entity configs', configs);

		for (const [slug, configOrFn] of configs?.entries()) {
			const config = await this.config.getConfig(slug)
			const preload = config?.preload;
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
