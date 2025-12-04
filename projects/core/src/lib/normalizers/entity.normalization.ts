import { MikaEntityConfig } from "../interfaces/entity/mika-entity-config.interface";
import { MikaBaseUrlsConfig } from "../interfaces/core/mika-app-config.interface";
import { MikaUrlHelper } from "../helpers/mika-endpoint.helper";

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

export function normalizeEntityConfig(config: Partial<MikaEntityConfig>, baseUrls: MikaBaseUrlsConfig): MikaEntityConfig {

	const apiBase = MikaUrlHelper.ensureBase(config.apiBaseUrl || baseUrls.apiBaseUrl);

	config.endpoints = {
		base: config.contentType,
		...(config.endpoints || {}),
	};

	const endpoints = config.endpoints;

	// نضمن base مع prefix
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
