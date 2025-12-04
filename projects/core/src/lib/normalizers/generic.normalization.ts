import { MikaUrlHelper } from "../helpers/mika-endpoint.helper";
import { MikaBaseUrlsConfig } from "../interfaces/core/mika-app-config.interface";

export const normalizeInterceptors = (raw: any): any[] => {
	if (!raw) return [];
	if (Array.isArray(raw)) return raw.filter(Boolean);
	if (typeof raw === 'function') return [raw];
	if (typeof raw === 'object') return [raw];
	console.warn('[MikaApp] Invalid interceptors format:', raw);
	return [];
}

export function normalizeBaseUrls(input: Partial<MikaBaseUrlsConfig>): MikaBaseUrlsConfig {
	const requiredKeys: (keyof MikaBaseUrlsConfig)[] = ['apiBaseUrl'];

	const output: Partial<MikaBaseUrlsConfig> = {};

	for (const key of Object.keys(input) as (keyof MikaBaseUrlsConfig)[]) {
		const value = input[key];
		const isRequired = requiredKeys.includes(key as keyof MikaBaseUrlsConfig);

		if (!value) {
			if (isRequired) {
				throw new Error(`[MikaForm] Missing required base URL: "${key}"`);
			}
			continue;
		}

		if (!isUrl(value)) {
			const msg = `[MikaForm] Invalid ${isRequired ? 'required' : 'optional'} base URL: "${key}" → ${value}`;
			if (isRequired) throw new Error(msg);
			console.warn(msg);
			continue;
		}

		output[key] = MikaUrlHelper.ensureBase(value);
	}

	// Double-check required keys in case they weren’t in input
	for (const required of requiredKeys) {
		if (!output[required]) {
			throw new Error(`[MikaForm] Missing required base URL: "${required}"`);
		}
	}

	return output as MikaBaseUrlsConfig;
}


function isUrl(value: string): boolean {
	if (typeof value !== 'string') return false;
	try {
		const url = new URL(value);
		return /^(https?:)\/\//.test(url.href); // enforce http/https
	} catch {
		return false;
	}
};
