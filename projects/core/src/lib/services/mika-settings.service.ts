import { Injectable } from '@angular/core';
import { MikaGlobalSettings } from '../interfaces/settings/mika-global-settings.interface';
@Injectable({ providedIn: 'root' })
export class MikaSettingsService {
	private globalSettings: MikaGlobalSettings = {
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

	setSettings(settings: Partial<MikaGlobalSettings>) {
		this.globalSettings = { ...this.globalSettings, ...settings };
	}

	getSettings(): MikaGlobalSettings {
		return this.globalSettings;
	}

	getSetting<T = any>(key: string, fallback?: T): T {
		return key.split('.').reduce((acc: any, part: string) => acc?.[part], this.globalSettings) ?? fallback;
	}
}
