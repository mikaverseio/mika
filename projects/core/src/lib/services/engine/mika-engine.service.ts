import { Inject, Injectable, Optional } from '@angular/core';
import { MikaHookService } from './mika-hook.service';
import { MikaCacheService } from '../data/mika-cache.service';
import { MikaStorageService } from '../infra/mika-storage.service';
import { MikaPreloadService } from '../data/mika-preload.service';
import { MikaI18nService } from '../infra/mika-i18n.service';
import { MikaAppService } from './mika-app.service';
import { MikaAppConfig } from '../../interfaces/core/mika-app-config.interface';
import { MikaAppConfigOptions } from '../../types/mika-app.type';
import { MIKA_APP_CONFIG } from '../../tokens';

@Injectable({ providedIn: 'root' })
export class MikaEngineService {

	contextedInitialize = false;

	constructor(
		public cache: MikaCacheService,
		public hook: MikaHookService,
		public preferences: MikaStorageService,
		private preloadService: MikaPreloadService,
		private languageService: MikaI18nService,
		public app: MikaAppService,
		@Optional() @Inject(MIKA_APP_CONFIG) injected: MikaAppConfigOptions | null
	) {
		if (injected && !this.contextedInitialize) {
			// re-evaluate from where is better to initialize
			this.initialize(injected);
		}
	}

	register(config: MikaAppConfig) {
		this.initialize(config);
	}

	async registerAsync(loader: () => Promise<MikaAppConfig>) {
		const result = await loader();
		this.register(result);
	}

	private initialize(config: MikaAppConfigOptions) {
		this.app.init(config);
		// move to app service
		this.languageService.register(this.app.settings()?.languages! || []);
		this.preloadService.handlePreload(this.app.settings()!, this.app.entityConfigs());
		//
		this.contextedInitialize = true;
	}
}
