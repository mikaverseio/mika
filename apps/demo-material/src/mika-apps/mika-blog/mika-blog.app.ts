import { postConfig } from "./post.config";
import { categoryConfig } from "./category.config";
import { MikaAppConfig, MikaEntityConfig } from "@mikaverse/core";
import { Routes } from "@angular/router";

export const entityConfig: Record<string, MikaEntityConfig | Function> = {
	'posts': postConfig,
	'categories': categoryConfig
}

export function makeMikaBlogApp(): MikaAppConfig {
	return {
		appId: 'mika-blog',
		baseUrls: {
			apiBaseUrl: 'http://localhost:3001', // api:demo2 (posts + categories)
		},
		auth: {
			endpoints: {
				login: 'auth/login',
				logout: 'auth/logout'
			},
			requestMap: {
				identifierKey: 'username',
			}
		},
		environments: [
			{
				id: 'blog-prod',
				name: 'Prod',
				production: true,
				apiBaseUrl: 'http://localhost:3001',
				default: true,
			},
			{
				id: 'blog-dev',
				name: 'Dev',
				production: false,
				apiBaseUrl: 'http://localhost:3001',
				default: false,
			}
		],
		i18n: {
			defaultLang: 'en',
			fallbackLang: 'en',
			i18nPath: '/assets/i18n/'
		},
		settings: {
			siteName: 'MikaBlog',
			noAuth: true,
		},
		entities: entityConfig,
		customRoutes: [
			{
				path: 'about',
				loadComponent: () => import('./pages/about.page').then(m => m.AboutPage),
				data: { sidebar: { label: 'About', icon: 'info', order: 99 } }
			}
		] as Routes
	}
}
