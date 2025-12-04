
import { MikaAuthConfig } from "../interfaces/core/mika-app-config.interface";
import { MikaGlobalConfig } from "../interfaces/settings/mika-global-config.interface";

export const mikaDefaultConfig: MikaGlobalConfig = {
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
