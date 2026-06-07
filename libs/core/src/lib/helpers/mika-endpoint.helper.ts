export class MikaUrlHelper {
	static replaceParams(template: string, params: Record<string, any>): string {
		return template.replace(/\/:([\w.]+)/g, (match, key) => {
			const value = this.getNestedValue(params, key);
			return value != null ? '/' + encodeURIComponent(value) : match;
		});
	}

	static getNestedValue(obj: any, path: string): any {
		if (!obj) return undefined;
		return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
	}

	static extractParamKeys(template: string): string[] {
		const matches = [...template.matchAll(/\/:([\w.]+)/g)];
		return matches.map(m => m[1]);
	}

	static ensureBase(base: string) {
		if (base.endsWith('/')) return base;
		return `${base}/`;
	}

	static prefixWithApiBase(url?: string, apiBase?: string): string {
		if (!url || !apiBase) return '';
		if (/^https?:\/\//.test(url)) return url;
		return this.ensureBase(apiBase) + url.replace(/^\/+/, '');
	}
}
