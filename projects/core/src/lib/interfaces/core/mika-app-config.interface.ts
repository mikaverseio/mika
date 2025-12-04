import { Type } from "@angular/core";
import { MikaGlobalConfig } from "../settings/mika-global-config.interface";
import { MikaEntityConfig } from "../entity/mika-entity-config.interface";
import { MikaLocalizationConfig } from "../entity/mika-localization-config.interface";
import { MikaPreloadConfig } from "../entity/mika-preload-config.interface";
import { Route, Routes } from "@angular/router";

// mika-auth-settings.interface.ts

export interface MikaAuthConfig {
	endpoints: {
		login: string,
		logout?: string;
		refreshToken?: string
	},

	headers?: {
		token: string
		tenant: string
	},

	propMap?: {
		identifier?: string;
		password?: string;
		role?: string,
		persmissions?: string;
		id?: string;
	},

	persistToken?: boolean;
	autoRefreshToken?: boolean;
}

// mika-permissions-settings.interface.ts
export interface MikaPermissionsConfig {
	permissionsSource?: 'manual' | 'definedEntity' | 'api';
	rolesSource?: 'manual' | 'definedEntity' | 'api';
	defaultAccessPolicy?: 'allow' | 'deny';

	permissionsApiEndpoint?: string;
	rolesApiEndpoint?: string;

	permissionsEntitySlug?: string;
	rolesEntitySlug?: string;
}

// mika-i18n-settings.interface.ts
export interface MikaI18nConfig {
	defaultLang?: string;
	fallbackLang?: string;
	translationFiles?: Record<string, any>;
	i18nPath?: string;
}

// mika-theming.interface.ts
export interface MikaThemingConfig {
	layout?: 'default' | 'minimal';
	brandColor?: string;
	logoUrl?: string;
	darkMode?: boolean;
}

// mika-features.interface.ts

export interface MikaEnvironmentConfig {
	id: string;
	name: string;
	production?: boolean;
	apiBaseUrl: string;
	default?: boolean;
	baseUrls?: MikaBaseUrlsConfig;
	[key: string]: any;
}

export interface MikaBaseUrlsConfig {
	apiBaseUrl: string;
	mediaBaseUrl?: string;
	publicSiteUrl?: string;
	cdnUrl?: string;
	analyticsApiUrl?: string;
}

export interface MikaAppConfig {
	appId: string;
	entities: any;
	auth?: MikaAuthConfig;

	domain?: string;
	baseUrls: MikaBaseUrlsConfig;
	settings?: MikaGlobalConfig;
	interceptors?: any[];
	componentOverrides?: Record<string, Type<any>>;

	permissions?: MikaPermissionsConfig;
	i18n?: MikaI18nConfig;
	contentLocalization?: MikaLocalizationConfig
	theming?: MikaThemingConfig;
	environments?: MikaEnvironmentConfig[];
	preload?: MikaPreloadConfig[]
	dashboards?: any[],

	customRoutes?: Routes
	default?: boolean;
}


