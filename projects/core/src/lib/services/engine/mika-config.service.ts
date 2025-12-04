import { Injectable } from '@angular/core';
import { MikaGlobalConfig } from '../../interfaces/settings/mika-global-config.interface';
@Injectable({ providedIn: 'root' })
export class MikaConfigService {
	private globalSettings: MikaGlobalConfig = {
		siteName: 'MikaForm',
		// apiBase: '',
		publicSiteUrl: '',
		logo: '',
		actions: {
			notifications: true,
			messages: true
		},
		sidebarMode: 'auto'
	};

	setSettings(settings: Partial<MikaGlobalConfig>) {
		this.globalSettings = { ...this.globalSettings, ...settings };
	}

	getSettings(): MikaGlobalConfig {
		return this.globalSettings;
	}

	getSetting<T = any>(key: string, fallback?: T): T {
		return key.split('.').reduce((acc: any, part: string) => acc?.[part], this.globalSettings) ?? fallback;
	}
}
