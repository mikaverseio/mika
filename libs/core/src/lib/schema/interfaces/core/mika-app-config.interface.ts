import { Type } from "@angular/core";
import { MikaGlobalConfig } from "../settings/mika-global-config.interface";
import { MikaEntityConfig } from "../entity/mika-entity-config.interface";
import { MikaLocalizationConfig } from "../entity/mika-localization-config.interface";
import { MikaPreloadConfig } from "../entity/mika-preload-config.interface";
import { Route, Routes } from "@angular/router";
import { MikaDashboardConfig } from "../settings/mika-dashboard-config.interface";

export type MikaLeaveDecision =
  | { kind: 'allow' }
  | { kind: 'confirm'; messageKey: string }
  | { kind: 'autosave' };

export interface MikaFormLeaveConfig {
  confirmLeave?: boolean;
  confirmLeaveMessage?: string; // translation key
  autoSaveOnLeave?: boolean;
}

export interface MikaFormLeaveContext {
  dirty: boolean;
  config?: MikaFormLeaveConfig;
  hasSubmitHandler: boolean;
}

// mika-auth-settings.interface.ts

export interface MikaAuthConfig {
	endpoints: {
		login: string,
		logout?: string;
		refreshToken?: string,
		me?: string
	},

	headers?: {
		token: string
		tenant: string
	},

	/**
     * Configuration for the HTTP Request sent during login.
     * Maps your internal form values to the API's expected keys.
     */
	requestMap?: {
		/** The key for the username/email field. Default: 'username' or 'email' */
        identifierKey?: string;

        /** The key for the password field. Default: 'password' */
        passwordKey?: string;
	},

	/**
     * Configuration for parsing the HTTP Response after login.
     * Tells Mika where to find the Token and User object.
     */
	responseMap?: {
		/** Path to the Auth Token (e.g. 'data.token' or 'access_token') */
        tokenPath?: string;

        /** Path to the Refresh Token (e.g. 'data.refreshToken') */
        refreshTokenPath?: string;

        /** Path to the User Object (e.g. 'data.user' or 'currentUser') */
        userPath?: string;
	},

	/**
     * Configuration for mapping the User Object properties to Mika's internal session.
     * Used to normalize diverse backends (Laravel, .NET, Node) into a standard MikaUser.
     */
    userIdentityMap?: {
        /** Default: 'id' */
        id?: string;
        /** Default: 'role' */
        role?: string;
        /** Default: 'permissions' */
        permissions?: string;
        /** Default: 'name' */
        name?: string;
        /** Default: 'avatar' */
        avatar?: string;
		email?: string;
    };

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
	dashboards?: MikaDashboardConfig[],

	customRoutes?: Routes
	default?: boolean;
}


