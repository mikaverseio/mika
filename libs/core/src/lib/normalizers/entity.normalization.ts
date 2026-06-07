import { MikaEntityConfig, MikaBaseUrlsConfig } from '../schema';
import { MikaUrlHelper } from '../helpers';

export function ensureEntityConfigMap(configs: any) {
	if (configs instanceof Map) {
		return configs;
	} else if (typeof configs === 'object' && configs !== null) {
		return new Map(Object.entries(configs));
	} else {
		throw new Error('Invalid config format: expected Map or Record.');
	}
}

export function normalizeEntityConfigMap(configs: any, baseUrls: MikaBaseUrlsConfig): Map<string, MikaEntityConfig> {
	const rawMap = ensureEntityConfigMap(configs); // reuses your util
	const result = new Map<string, MikaEntityConfig>();

	for (const [key, value] of rawMap.entries()) {
		result.set(key, value);
	}

	return result;
}

export function normalizeEntityConfigs(config: Partial<MikaEntityConfig>, baseUrls: MikaBaseUrlsConfig): MikaEntityConfig {

	const apiBase = MikaUrlHelper.ensureBase(config.apiBaseUrl || baseUrls.apiBaseUrl);

	config.endpoints = {
		base: config.contentType,
		...(config.endpoints || {}),
	};

	const endpoints = config.endpoints;

	const basePrefixed = endpoints.base
		? MikaUrlHelper.prefixWithApiBase(endpoints.base, apiBase)
		: undefined;

	endpoints.base = basePrefixed;

	endpoints.list = MikaUrlHelper.prefixWithApiBase(endpoints.list ?? basePrefixed, apiBase);
	endpoints.create = MikaUrlHelper.prefixWithApiBase(endpoints.create ?? basePrefixed, apiBase);

	endpoints.get = MikaUrlHelper.prefixWithApiBase(
		endpoints.get ?? `${basePrefixed}/:id`,
		apiBase
	);

	endpoints.update = MikaUrlHelper.prefixWithApiBase(
		endpoints.update?.replace(':id', config.contentId?.toString() ?? '') ?? `${basePrefixed}/:id`,
		apiBase
	);

	endpoints.delete = MikaUrlHelper.prefixWithApiBase(
		endpoints.delete ?? `${basePrefixed}/:id`,
		apiBase
	);

	endpoints.allResults = MikaUrlHelper.prefixWithApiBase(
		endpoints.allResults ?? `${basePrefixed}/all`,
		apiBase
	);

	if (endpoints.custom) {
		for (const key in endpoints.custom) {
			if (Object.prototype.hasOwnProperty.call(endpoints.custom, key)) {
				const url = endpoints.custom[key].url;
				if (typeof url === 'string') {
					endpoints.custom[key].url = MikaUrlHelper.prefixWithApiBase(url, apiBase);
				}
			}
		}
	}

	return {
		...config,
		endpoints,
		table: {
			...config.table,
			sortable: config.table?.sortable ?? true,
		},
		actions: {
			show: config.actions?.show ?? true,
			bulk: config.actions?.bulk ?? [],
			items: config.actions?.items ?? {},
		},
		form: {
			...config.form,
			fields: config.form?.fields ?? [],
			components: config.form?.components ?? [],
			config: config.form?.config ?? {}
		}
	} as MikaEntityConfig;
}


/**
 * 🛠️ Helper method to normalize internal entity config structure.
 * 🛑 CRITICAL CHANGE: This method NO LONGER prefixes URLs with baseUrls.
 * It only ensures paths are relative and defaults are set.
 */
export function normalizeEntityConfig(config: Partial<MikaEntityConfig>): MikaEntityConfig {

    // 1. Set safe defaults for endpoints
    config.endpoints = {
        base: config.contentType, // Default is usually the contentType slug
        ...(config.endpoints || {}),
    };

    const endpoints = config.endpoints;
    const baseEndpoint = endpoints.base ?? config.contentType; // The relative path

    // 2. Ensure all endpoints are RELATIVE paths (by removing leading slashes if they exist, or adding them)
    // We want all final endpoints to be like "posts" or "posts/:id", not absolute URLs.

    // Default derived endpoints based on BASE but DO NOT PREFIX with API Base URL
    endpoints.base = baseEndpoint;
    endpoints.list = endpoints.list ?? baseEndpoint;
    endpoints.create = endpoints.create ?? baseEndpoint;

    // Use string substitution for dynamic parts (e.g. for json-server compatibility)
    endpoints.get = endpoints.get ?? `${baseEndpoint}/:id`;
    endpoints.update = endpoints.update ?? `${baseEndpoint}/:id`;
    endpoints.delete = endpoints.delete ?? `${baseEndpoint}/:id`;
    endpoints.allResults = endpoints.allResults ?? `${baseEndpoint}/all`;

    // 3. Handle Custom Endpoints (Ensure they remain relative)
    if (endpoints.custom) {
        for (const key in endpoints.custom) {
            if (Object.prototype.hasOwnProperty.call(endpoints.custom, key)) {
                const url = endpoints.custom[key].url;
                if (typeof url === 'string') {
                    // 🛑 Ensure we only store the relative path for custom URLs
                    endpoints.custom[key].url = url.replace(/^\//, '');
                }
            }
        }
    }

    // 4. Set Action/Table defaults
    return {
        ...config,
        endpoints,
        table: {
            ...config.table,
            sortable: config.table?.sortable ?? true,
        },
        actions: {
            show: config.actions?.show ?? true,
            bulk: config.actions?.bulk ?? [],
            items: config.actions?.items ?? {},
        },
        form: {
            ...config.form,
            fields: config.form?.fields ?? [],
            components: config.form?.components ?? [],
            config: config.form?.config ?? {}
        }
    } as MikaEntityConfig;
}
