import { Injectable, signal } from '@angular/core';
import { MikaAppConfig } from '../../interfaces/core/mika-app-config.interface';

@Injectable({ providedIn: 'root' })
export class MikaAppContextService {
	private currentApp = signal<MikaAppConfig | null>(null);

	setApp(app: MikaAppConfig) {
		this.currentApp.set(app);
	}

	get app(): MikaAppConfig {
		const app = this.currentApp();
		if (!app) throw new Error('[Mika] No app config set');
		return app;
	}

	get apiBase(): string {
		return this.app.baseUrls.apiBaseUrl;
	}

	get appId(): string {
		return this.app.appId;
	}

	get i18n() {
		return this.app.i18n;
	}

	readonly = this.currentApp.asReadonly();
}
