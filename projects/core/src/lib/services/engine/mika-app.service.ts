import { Injectable, signal, computed, inject, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaStorageService } from '../infra/mika-storage.service';
import { resolveMediaUrl, setTenantMode } from '../../utils/mika-app.util';
import { normalizeEntityConfig } from '../../normalizers/entity.normalization';
import { MikaAppConfig } from '../../interfaces/core/mika-app-config.interface';
import { normalizeAppsConfig } from '../../normalizers/app.normalization';
import { MikaAppConfigOptions } from '../../types/mika-app.type';
import { MikaSidebarGroupConfig } from '../../interfaces/sidebar/mika-sidebar-group-config.interface';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { MikaKey } from '../../enum/mika-key.enum';
import { uuid } from '../../utils/utils';
import { MikaAppContextService } from './mika-app-context.service';

@Injectable({ providedIn: 'root' })
export class MikaAppService {

	private preferences = inject(MikaStorageService);
	private injector = inject(EnvironmentInjector);
	private appContext = inject(MikaAppContextService);

	readonly defaultApp = computed(() => {
		const apps = this.apps();
		for (const app of apps.values()) {
		  if (app.default) return app;
		}
		return apps.values().next().value;
	});

	private apps = signal<Map<string, MikaAppConfig>>(new Map());
	private activeAppId = signal<string | null>(null);
	private activeEnvironmentId = signal<string | null>(null);
	private runtimeCache = new Map<string, MikaEntityConfig>();

	// Signals for user and token (can be extended later)
	currentUser = signal<any | null>(null);
	currentToken = signal<string | null>(null);

	settings = computed(() => this.getActiveApp()?.settings);
	entityConfigs = computed(() => this.getActiveApp()?.entities);
	dashboards = computed(() => this.getActiveApp()?.dashboards);
	sidebarGroups = computed(() => this.getActiveApp()?.settings?.sidebarGroups);
	appsCount = computed(() => this.apps().size);
	appMode = computed(() => setTenantMode(this.appsCount()));
	auth = computed(() => this.getActiveApp()?.auth);
	permissions = computed(() => this.getActiveApp()?.permissions);
	environments = computed(() => this.getActiveApp()?.environments);
	i18n = computed(() => this.getActiveApp()?.i18n);
	theming = computed(() => this.getActiveApp()?.theming);

	private noMenuPages = ['/login', '/register', '/reset-password'];
	menus = signal(new Array<MikaSidebarGroupConfig>);
	showMenu = signal(true);

	init(config: MikaAppConfigOptions) {
		const apps = normalizeAppsConfig(config);
		this.apps.set(apps);

		this.regiseterApps();
	}

	regiseterApps() {
		this.apps().forEach((app) => {
			this.registerApp(app);
		});

		if (this.apps().size === 1) {
			const onlyAppId = this.apps().keys().next().value;
			this.activateApp(onlyAppId!);
		} else {
			this.autoActivateByDomain();
		}
	}

	registerApp(config: MikaAppConfig) {
		const newApps = new Map(this.apps());
		newApps.set(config.appId, config);
		this.apps.set(newApps);
		this.preferences.set(MikaKey.AppCount, newApps.size);
	}

	async activateApp(id: string) {
		console.log(`[MikaApp] Activating app "${id}"`);
		if (!this.apps().has(id)) {
			throw new Error(`[MikaApp] Cannot activate unknown app "${id}"`);
		}
		this.activeAppId.set(id);

		const app = this.getApp(id);
		this.appContext.setApp(app!);
		if (!app) return;

		const defaultEnv = app.environments?.find(e => e.default) ?? app.environments?.[0];
		this.activeEnvironmentId.set(defaultEnv?.id ?? null);

		console.log('[MikaApp] Activated app:', app);

		Mika.set(app.settings!);
		await this.renderSidebar();
	}

	autoActivateByDomain() {
		const hostname = window.location.hostname;
		if (hostname === 'localhost' || hostname === '127.0.0.1') {
			const override = new URLSearchParams(window.location.search).get('app');
			if (override && this.apps().has(override)) {
				this.activateApp(override);
				console.warn(`[MikaApp] Dev override: activated app "${override}"`);
			}
			return;
		}
		for (const [id, config] of this.apps()) {
			if (config.domain === hostname) {
				this.activateApp(id);
				return;
			}
		}
		console.error(`[MikaApp] No app matched domain "${hostname}"`);
	}

	setDefaultAppId(id: string) {
		// this.defaultAppId = id;
	}

	getDefaultAppId(): string {
		return this.defaultApp()?.appId!;

	}

	getDefaultApp() {
		return this.defaultApp();
	}

	clearApps() {
		this.apps.set(new Map());
		this.activeAppId.set(null);
	}

	getActiveAppId() {
		return this.activeAppId();
	}

	getActiveApp(): MikaAppConfig | null {
		const id = this.activeAppId();
		return id ? this.apps().get(id) ?? null : null;
	}

	getApp(id: string) {
		return this.apps().get(id);
	}

	getAllApps(): MikaAppConfig[] {
		return Array.from(this.apps().values());
	}

	getAllAppIds(): string[] {
		return Array.from(this.apps().keys());
	}

	getSetting<T = any>(key: string, fallback?: T): T {
		return key.split('.').reduce((acc: any, part) => acc?.[part], this.settings()) ?? fallback;
	}

	getEntityConfig(contentType: string): any {
		const configs = this.entityConfigs();
		return configs instanceof Map
			? configs.get(contentType)
			: configs?.[contentType];
	}

	async getConfig(contentType: string): Promise<MikaEntityConfig> {
		const app = this.getActiveApp();
		const cacheKey = `${app?.appId}-${contentType}`;

		const cached = this.runtimeCache.get(cacheKey);
		if (cached) return cached;

		const raw = this.getEntityConfig(contentType);
		let config: MikaEntityConfig;

		if (typeof raw === 'function') {
			const resolved = await this.executeWithFallback(raw);

			if (!resolved || typeof resolved !== 'object') {
				throw new Error(`[MikaEntity] Function config for "${contentType}" is invalid or returned nothing.`);
			}

			if ((resolved as any).__normalized) {
				config = resolved as MikaEntityConfig;
			} else {
				config = normalizeEntityConfig(resolved, app?.baseUrls!);
				(config as any).__normalized = true;
			}

		} else if (typeof raw === 'object' && raw !== null) {
			config = normalizeEntityConfig(raw, app?.baseUrls!);
		} else {
			throw new Error(`[MikaEntity] Invalid config for "${contentType}"`);
		}

		this.runtimeCache.set(cacheKey, config);
		return config;
	}

	async executeWithFallback(fn: () => any): Promise<any> {
		try {
			return await runInInjectionContext(this.injector, () => fn());
		} catch (err) {
			console.warn('[MikaEntity] Injection context failed, falling back to direct execution', err);
			return await fn(); // ← fallback to raw execution
		}
	}


	// async getConfig(contentType: string): Promise<MikaEntityConfig> {
	// 	const tenant = this.getActiveApp();
	// 	const cacheKey = `${tenant}-${contentType}`;
	// 	const cached = this.runtimeCache.get(cacheKey);

	// 	if (cached) return cached;

	// 	const raw = this.getEntityConfig(contentType);
	// 	let config: MikaEntityConfig;
	// 	if (typeof raw === 'function') {
	// 		config = await runInInjectionContext(this.injector, () => raw());
	// 	} else if (typeof raw === 'object' && raw !== null) {
	// 		config = raw;
	// 	} else {
	// 		throw new Error(`[MikaEntity] Invalid config for "${contentType}"`);
	// 	}

	// 	this.runtimeCache.set(cacheKey, config);
	// 	return config;
	// }

	// async registerAsyncEntityConfigs(loader: () => Promise<any>) {
	// 	try {
	// 		const configs = await loader();
	// 		this.mergeEntityConfigs(configs);
	// 	} catch (error) {
	// 		console.error('[MikaApp] Failed to load async configs:', error);
	// 	}
	// }

	// mergeEntityConfigs(configs: any) {
	// 	const tenantId = this.activeTenantId();
	// 	if (!tenantId) throw new Error('[MikaApp] Cannot merge configs: no active tenant');
	// 	const tenants = new Map(this.tenants());
	// 	const tenant = mergeEntityConfigs(configs, tenantId, tenants)
	// 	tenants.set(tenantId, tenant!);
	// 	this.tenants.set(tenants);
	// }

	resolveMediaUrl(path: string): string {
		return resolveMediaUrl(path, this.settings()?.mediaBaseUrl || this.settings()?.publicSiteUrl!);
	}

	async renderSidebar(tenantSidebarGroups?: MikaSidebarGroupConfig[]): Promise<MikaSidebarGroupConfig[]> {
		const settings = this.getActiveApp()?.settings;
		if (!tenantSidebarGroups || tenantSidebarGroups!.length !== 0) {
			tenantSidebarGroups = settings?.sidebarGroups ?? [];
		}

		const hasUserDefinedItems = tenantSidebarGroups?.some(g => g.items && g.items.length);

		// If user provided full menu items manually, return as is
		if (settings?.sidebarMode === 'manual' && hasUserDefinedItems) {
			return tenantSidebarGroups!;
		}

		// AUTO mode: build from registered configs
		const groupsMap = new Map<string, MikaSidebarGroupConfig>();

		// for (const [key, config] of this.entityConfigs().entries()) {
		// 	const resolved = await this.getConfig(key);
		// 	const sidebarConfig = resolved.sidebarConfig;

		// 	if (sidebarConfig?.hidden || sidebarConfig?.showInSidebar === false) continue;

		// 	const groupKey = sidebarConfig?.sidebarGroup ?? 'General';
		// 	const groupMeta = tenantSidebarGroups?.find(g => g.key === groupKey);

		// 	if (!groupsMap.has(groupKey)) {
		// 		groupsMap.set(groupKey, {
		// 			key: groupKey,
		// 			label: groupMeta?.label ?? groupKey,
		// 			order: groupMeta?.order ?? 999,
		// 			items: []
		// 		});
		// 	}

		// 	const iconName = sidebarConfig?.icon ?? 'apps';
		// 	// this.registerIcon(iconName);

		// 	groupsMap.get(groupKey)!.items?.push({
		// 		// key: uuid(),
		// 		label: sidebarConfig?.label ?? resolved.contentType,
		// 		route: `/${resolved.contentType}`,
		// 		icon: iconName,
		// 		order: sidebarConfig?.order ?? 999
		// 	});
		// }

		for (const [key, config] of this.entityConfigs().entries()) {
			const resolved = await this.getConfig(key);
			const sidebarConfig = resolved.sidebarConfig;

			if (!resolved.contentType) {
				// console.warn(`No contentType for`, resolved);
			}

			if (!resolved?.contentType || sidebarConfig?.hidden || sidebarConfig?.showInSidebar === false)
				continue;

			const groupKey = sidebarConfig?.sidebarGroup ?? 'General';
			const groupMeta = tenantSidebarGroups?.find(g => g.key === groupKey);

			if (!groupsMap.has(groupKey)) {
				groupsMap.set(groupKey, {
					key: groupKey,
					label: groupMeta?.label ?? groupKey,
					order: groupMeta?.order ?? 999,
					items: []
				});
			}

			const iconName = sidebarConfig?.icon ?? 'apps';

			groupsMap.get(groupKey)!.items!.push({
				label: sidebarConfig?.label ?? resolved.contentType,
				route: `/${resolved.contentType}`,
				icon: iconName,
				order: sidebarConfig?.order ?? 999
			});
		}

		// Sort items within groups
		for (const group of groupsMap.values()) {
			group.items?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
		}

		const sidebarGroups = Array.from(groupsMap.values());

		this.menus.set(sidebarGroups);

		// Sort entire groups by order (from user config if available)
		return sidebarGroups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	}

}
