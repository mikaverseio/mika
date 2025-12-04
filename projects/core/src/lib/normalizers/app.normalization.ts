import { mikaDefaultAuthConfig, mikaDefaultSettings } from "../core/defatul.settings";
import { MikaAppConfig, MikaAuthConfig } from "../interfaces/mika-app-config.interface";
import { normalizeEntityConfigMap } from "./entity.normalization";
import { normalizeBaseUrls } from "./generic.normalization";

export function normalizeAppsConfig(input: MikaAppConfig | MikaAppConfig[]): Map<string, MikaAppConfig> {
	const configs = Array.isArray(input) ? input : [input];
	const map = new Map<string, MikaAppConfig>();

	for (const config of configs) {
		if (!config?.appId) {
			throw new Error('[MikaAppConfig] Missing tenantId');
		}
		map.set(config.appId, normalizeAppConfig(config));
	}

	return map;
}

export function normalizeAppConfig(config: MikaAppConfig): MikaAppConfig {
	if (!config?.appId) {
		throw new Error('[MikaAppConfig] Missing tenantId');
	}

	config.baseUrls = normalizeBaseUrls(config.baseUrls);
	config.entities = normalizeEntityConfigMap(config.entities, config.baseUrls);
	config.settings = {...mikaDefaultSettings, ...config.settings };
	config.auth = {...mikaDefaultAuthConfig, ...config.auth };


	return config;
}


