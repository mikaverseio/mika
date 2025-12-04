import { Type } from "@angular/core";
import { MikaGlobalSettings } from "./settings/mika-global-settings.interface";
import { MikaEntityConfig } from "./entity/mika-entity-config.interface";
import { MikaContentLocalizationSettings } from "./entity/mika-language.interface";
import { MikaPreloadConfig } from "./entity/preload-config.interface";
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
export interface MikaPermissionsSettings {
	permissionsSource?: 'manual' | 'definedEntity' | 'api';
	rolesSource?: 'manual' | 'definedEntity' | 'api';
	defaultAccessPolicy?: 'allow' | 'deny';

	permissionsApiEndpoint?: string;
	rolesApiEndpoint?: string;

	permissionsEntitySlug?: string;
	rolesEntitySlug?: string;
}

// mika-i18n-settings.interface.ts
export interface MikaI18nSettings {
	defaultLang?: string;
	fallbackLang?: string;
	translationFiles?: Record<string, any>;
	i18nPath?: string;
}

// mika-theming.interface.ts
export interface MikaThemingSettings {
	layout?: 'default' | 'minimal';
	brandColor?: string;
	logoUrl?: string;
	darkMode?: boolean;
}

// mika-features.interface.ts

export interface MikaEnvironment {
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
	settings?: MikaGlobalSettings;
	interceptors?: any[];
	componentOverrides?: Record<string, Type<any>>;

	permissions?: MikaPermissionsSettings;
	i18n?: MikaI18nSettings;
	contentLocalization?: MikaContentLocalizationSettings
	theming?: MikaThemingSettings;
	environments?: MikaEnvironment[];
	preload?: MikaPreloadConfig[]
	dashboards?: any[],

	customRoutes?: Routes
	default?: boolean;
}


