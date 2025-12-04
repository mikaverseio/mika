import { postConfig } from "./post.config";
import { categoryConfig } from "./category.config";
import { MikaAppConfig, MikaEntityConfig } from "@mikaverse/core";
// import { qushqushRoutes } from "./qushqush.routes";

export const entityConfig: Record<string, MikaEntityConfig | Function> = {
	'posts': postConfig,
	'categories': categoryConfig
}

export function makeMikaBlogApp(): MikaAppConfig {
	return {
		appId: 'mika-blog',
		baseUrls: {
			apiBaseUrl: 'http://localhost:3007',
			publicSiteUrl: '',
		},
		auth: {
			endpoints: {
				login: 'auth/login',
				logout: 'auth/logout'
			},
			propMap: {
				identifier: 'username',
			}
		},
		i18n: {
			defaultLang: 'ar',
			fallbackLang: 'en',
			i18nPath: '/assets/i18n/'
		},
		settings: {
			// authConfig: {
			// 	loginEndpoint: 'auth/login'
			// },
			siteName: 'MikaBlog',
			// apiBase: environment.apiBase,
			publicSiteUrl: '',
			logo: '/public/logo.png',
			actions: {
				notifications: true,
				messages: true
			},

			responseProps: {
				data: 'data'
			}
		},
		entities: entityConfig
	}
}
