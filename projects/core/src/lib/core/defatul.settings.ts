
import { MikaAuthConfig } from "../interfaces/mika-app-config.interface";
import { MikaGlobalSettings } from "../interfaces/settings/mika-global-settings.interface";

export const mikaDefaultSettings: MikaGlobalSettings = {
	siteName: 'MikaForm',
	actions: {
		notifications: true,
		messages: true
	}
}

export const mikaDefaultAuthConfig: MikaAuthConfig = {
	endpoints: {
		login: 'auth/login'
	}
}
