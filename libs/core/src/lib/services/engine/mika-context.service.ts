import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaStorageService } from '../infra/mika-storage.service';
import { resolveMediaUrl, setTenantMode } from '../../utils/mika-app.util';
import { MikaAppConfig, MikaEnvironmentConfig, MikaAppConfigOptions, MikaKeys, MikaEntityConfig } from '../../schema';
import { normalizeAppsConfig } from '../../normalizers/app.normalization';
import { MikaAppContextService } from './mika-app-context.service';
import { MikaLoggerService } from '../infra/mika-logger.service';
import { BehaviorSubject } from 'rxjs';
import { getMapEntries } from '../../utils';

@Injectable({ providedIn: 'root' })
export class MikaContextService {

	private preferences = inject(MikaStorageService);
	private appContext = inject(MikaAppContextService);
	private logger = inject(MikaLoggerService);
	private injector = inject(Injector);

	private apps = signal<Map<string, MikaAppConfig>>(new Map());
	private activeAppId = signal<string | null>(null);
	private activeEnvironmentId = signal<string | null>(null);

	readonly defaultApp = computed(() => {
		const apps = this.apps();
		for (const app of apps.values()) {
			if (app.default) return app;
		}
		return apps.values().next().value;
	});

	activeEnvironment = computed<MikaEnvironmentConfig | undefined>(() => {
		const envId = this.activeEnvironmentId();
		const appEnvs = this.environments();
		if (!envId || !appEnvs) return undefined;
		return appEnvs.find(e => e.id === envId);
	});

	settings = computed(() => this.getActiveApp()?.settings);
	entityConfigs = computed(() => this.getActiveApp()?.entities);
	entityConfigsArray = computed(() => {
		const entities = this.entityConfigs();
		const array = getMapEntries(entities) as MikaEntityConfig[];
		console.log('arrrrrrr', array);
		return array;
	});
	dashboards = computed(() => this.getActiveApp()?.dashboards);
	sidebarGroups = computed(() => this.getActiveApp()?.settings?.sidebarGroups);
	appsCount = computed(() => this.apps().size);
	appMode = computed(() => setTenantMode(this.appsCount()));
	auth = computed(() => this.getActiveApp()?.auth);
	permissions = computed(() => this.getActiveApp()?.permissions);
	environments = computed(() => this.getActiveApp()?.environments);
	i18n = computed(() => this.getActiveApp()?.i18n);
	theming = computed(() => this.getActiveApp()?.theming);

	totalEntityCount = computed(() => {
        let total = 0;
        const apps = this.apps();
        for (const app of apps.values()) {
            const entities = app.entities;
            if (entities) {
                total += entities.size;
            }
        }
        return total;
    });

	private _contextChange = new BehaviorSubject<string | null>(null);
	public contextChange$ = this._contextChange.asObservable();

	init(config: MikaAppConfigOptions) {
		console.log('Initializing MikaContextService with', config);
		const apps = normalizeAppsConfig(config);
		if (apps.size === 0) return;

		this.apps.set(apps);
		this.regiseterApps();
	}

	async regiseterApps() {
		this.apps().forEach((app) => {
			this.registerApp(app);
		});

		await this.determineAndActivateApp();
	}

	registerApp(config: MikaAppConfig) {
		const newApps = new Map(this.apps());
		newApps.set(config.appId, config);
		this.apps.set(newApps);
		this.preferences.set(MikaKeys.AppCount, newApps.size);
	}

	private async determineAndActivateApp() {
		const defaultApp = this.defaultApp();

		// 1. Check Storage for the user's LAST ACTIVE app ID
		const storedAppId = await this.preferences.get(MikaKeys.ActiveAppId);

		let targetAppId: string | null = null;

		// Check 1: Use the stored ID if it's a valid, registered app
		if (storedAppId && this.apps().has(storedAppId)) {
			targetAppId = storedAppId;
		}
		// Check 2: If no stored ID, use the configured default app
		else if (defaultApp) {
			targetAppId = defaultApp.appId;
		}
		// Check 3: Fallback to the first available app if all else fails (e.g., single app setup)
		else if (this.apps().size > 0) {
			targetAppId = this.apps().keys().next().value!;
		}

		if (targetAppId) {
			await this.activateApp(targetAppId);
		} else {
			// Handle no apps found (redirect to /welcome)
			console.error('[MikaContext] No available apps to activate.');
			// This is handled by the main routing guard anyway, but good for logs.
		}
	}

	async activateApp(id: string) {
		this.logger.info('MikaContextService', `Activating app "${id}"...`);

		if (!this.apps().has(id)) {
			throw new Error(`[MikaApp] Cannot activate unknown app "${id}"`);
		}

		const app = this.getApp(id);
		if (!app) return;

		// Set App ID
		this.activeAppId.set(id);
		this.appContext.setApp(app!);

		// Set Settings
		Mika.set(app.settings!);

		// Set Env
		if (app.environments && app.environments.length) {
			const targetEnv = await this.processEnvironment(app);
			this.setActiveEnvironment(targetEnv?.id!);
		}

		// Emit context change
		this._contextChange.next(this.activeAppId()!);

		this.logger.info('MikaContextService', 'Activated app:', app.appId);
	}

	async processEnvironment(app: MikaAppConfig) {
		const persistedEnvId = await this.preferences.get(`${MikaKeys.EnvPrefix}${app.appId}`);
		let targetEnv: MikaEnvironmentConfig | undefined;

		if (persistedEnvId) {
			targetEnv = app.environments?.find(e => e.id === persistedEnvId);
		}

		if (!targetEnv) {
			targetEnv = app.environments?.find(e => e.default) ?? app.environments?.[0];
		}

		return targetEnv;
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

	async setActiveEnvironment(envId: string): Promise<void> {
		if (this.activeEnvironmentId() === envId) return;

		const currentApp = this.getActiveApp();
		if (!currentApp || !currentApp.environments?.some(e => e.id === envId)) {
			console.error(`[MikaContext] Environment ID "${envId}" not found in active app.`);
			return;
		}

		this.activeEnvironmentId.set(envId);

		try {
			await this.preferences.set(`${MikaKeys.EnvPrefix}${currentApp.appId}`, envId);
		} catch (e) {
			console.error('[MikaContext] Failed to persist environment selection.', e);
		}
	}

	getActiveEnvironmentId(): string | null {
		return this.activeEnvironmentId();
	}

	resolveMediaUrl(path: string): string {
		return resolveMediaUrl(path, this.getActiveApp()?.baseUrls?.mediaBaseUrl || this.getActiveApp()?.baseUrls?.publicSiteUrl || '');
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

}
