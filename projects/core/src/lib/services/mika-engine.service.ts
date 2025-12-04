import { Inject, Injectable, Optional } from '@angular/core';
import { MikaHookService } from './mika-hook.service';
import { MikaCacheService } from './mika-cache.service';
import { MikaPreferencesService } from './mika-preferences.service';
import { MikaPreloadService } from './mika-preload.service';
import { MikaLanguageService } from './mika-language.service';
import { MikaAppService } from './mika-app.service';
import { MikaAppConfig } from '../interfaces/core/mika-app-config.interface';
import { MikaAppConfigOptions } from '../types/mika-app.type';
import { MIKA_APP_CONFIG } from '../tokens';

@Injectable({ providedIn: 'root' })
export class MikaEngineService {

	contextedInitialize = false;

	constructor(
		public cache: MikaCacheService,
		public hook: MikaHookService,
		public preferences: MikaPreferencesService,
		private preloadService: MikaPreloadService,
		private languageService: MikaLanguageService,
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
