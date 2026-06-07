import { Injectable } from '@angular/core';
import { MikaHookService } from './mika-hook.service';
import { MikaCacheService } from '../data/mika-cache.service';
import { MikaStorageService } from '../infra/mika-storage.service';
import { MikaPreloadService } from '../data/mika-preload.service';
import { MikaI18nService } from '../infra/mika-i18n.service';
import { MikaContextService } from './mika-context.service';
import { MikaAppConfig } from '../../interfaces/core/mika-app-config.interface';
import { MikaAppConfigOptions } from '../../types/mika-app.type';
import { MIKA_APP_CONFIG } from '../../tokens';
import { MikaLoggerService } from '../infra/mika-logger.service';

@Injectable({ providedIn: 'root' })
export class MikaEngineService {

	private isInitialized = false;


	constructor(
		public cache: MikaCacheService,
		public hook: MikaHookService,
		public preferences: MikaStorageService,
		private preloadService: MikaPreloadService,
		private i18nService: MikaI18nService,
		public context: MikaContextService,
		private logger: MikaLoggerService

	) {

	}

	register(config: MikaAppConfig) {
		if (this.isInitialized) {
            console.warn('[MikaEngine] Already initialized. Skipping register.');
            return;
        }

		this.initialize(config);
	}

	async registerAsync(loader: () => Promise<MikaAppConfig>) {
		const result = await loader();
		this.register(result);
	}

	private initialize(config: MikaAppConfigOptions) {
		this.logger.setDebugMode(true);

		this.logger.info('MikaEngine', 'Initializing...');

		// 1. Init Context (Sets active tenant, merged settings)
        this.context.init(config);

		// 2. Register Languages
		// this.i18nService.register(this.context.settings()?.languages! || []);

		// 3. Preload Entities (Async data fetching)
        this.preloadService.handlePreload(
            this.context.settings()!,
            this.context.entityConfigs()
        );

		this.isInitialized = true;
	}
}
