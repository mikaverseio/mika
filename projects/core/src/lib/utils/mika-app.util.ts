import { MikaKeys } from "../enum/mika-key.enum";

// export const mergeEntityConfigs = (configs: any, tenantId: string, tenants: Map<string, MikaTenantConfig>) => {
// 	const tenant = tenants.get(tenantId);
// 	if (!tenant) return;

// 	if (!tenant.entityConfigs) tenant.entityConfigs = {};

// 	const merged = tenant.entityConfigs instanceof Map
// 		? new Map(tenant.entityConfigs)
// 		: new Map(Object.entries(tenant.entityConfigs));

// 	if (configs instanceof Map) {
// 		configs.forEach((v, k) => merged.set(k, v));
// 	} else {
// 		Object.entries(configs).forEach(([k, v]) => merged.set(k, v));
// 	}

// 	tenant.entityConfigs = merged;

// 	return tenant;
// }



export const resolveMediaUrl = (path: string, base: string): string => {
	if (!path || typeof path !== 'string') return '';

	// If full URL, return as-is
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	if (!base) {
		console.warn('[MikaApp] No base URL found for media path:', path);
		return path; // fallback to raw path if no base
	}

	// Clean slashes: avoid double slashes or missing slashes
	const cleanedBase = base.replace(/\/+$/, '');
	const cleanedPath = path.replace(/^\/+/, '');

	return `${cleanedBase}/${cleanedPath}`;
}

// export const formatDefaultTenantConfig = (defaultTenantId: string, config: Partial<MikaTenantConfig>): MikaTenantConfig => {
// 	const defaults = {
// 		tenantId: defaultTenantId,
// 		domain: 'localhost',
// 		settings: config.settings!,
// 		entityConfigs: normalizeEntityConfigMap(config.entityConfigs!),
// 		dashboard: config.dashboard,
// 		roles: config.roles ?? {},
// 	};
// 	return defaults;
// }

export const setTenantMode = (tenantCount: number): string => {
	if (tenantCount > 1) {
		return 'multiple';
	} else if (tenantCount === 1) {
		return 'single';
	} else {
		return 'none';
	}
}


export const arabicMap: Record<string, string> = {
	'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
	'ب': 'b', 'ت': 't', 'ث': 'th',
	'ج': 'j', 'ح': 'h', 'خ': 'kh',
	'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
	'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
	'ط': 't', 'ظ': 'z', 'ع': 'aa', 'غ': 'gh',
	'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
	'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
	'ي': 'y', 'ى': 'a', 'ئ': 'y', 'ء': '', 'ة': 'h'
};

export const slugifys = (text: string): string  => {
	return text
	  .split('')
	  .map(char => {
		if (arabicMap[char]) return arabicMap[char];
		return char;
	  })
	  .join('')
	  .normalize('NFKD')
	  .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
	  .toLowerCase()
	  .trim()
	  .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
	  .replace(/\s+/g, '-')        // Replace spaces with -
	  .replace(/-+/g, '-');        // Collapse dashes
}

export function extractAppIcons(app: any): Set<string> {
	const icons = new Set<string>();

	// 1. Sidebar groups → items
	app.settings?.sidebarGroups?.forEach((group: any) =>
		group.items?.forEach((item: any) => item.icon && icons.add(item.icon))
	);

	// 2. Entities → sidebarConfig.icon
	for (const [, config] of app.entities ?? []) {
		const sidebarIcon = config?.sidebarConfig?.icon;
		if (sidebarIcon) icons.add(sidebarIcon);
	}

	// 3. Dashboards → dashboard.icon + group.icon + widget.icon
	app.dashboards?.forEach((dashboard: any) => {
		if (dashboard.icon) icons.add(dashboard.icon);

		dashboard.groups?.forEach((group: any) => {
			if (group.icon) icons.add(group.icon);
			group.widgets?.forEach((w: any) => w.icon && icons.add(w.icon));
		});
	});

	return icons;
}
