import { EnvironmentInjector, Injectable, computed, inject, runInInjectionContext } from '@angular/core';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { normalizeEntityConfig } from '../../normalizers/entity.normalization';
import { MikaContextService } from './mika-context.service'; // Inject Context
import { MikaLoggerService } from '../infra/mika-logger.service';
import { MikaUrlHelper } from '../../helpers';
import { EMikaAction } from '../../enum';
import { executeWithContextFallback } from '../../utils';

@Injectable({ providedIn: 'root' })
export class MikaConfigService {
	private context = inject(MikaContextService);
	private logger = inject(MikaLoggerService);
	private runtimeCache = new Map<string, MikaEntityConfig>();
	private injector = inject(EnvironmentInjector);

	// ----------------------------------------------------
	// PUBLIC API
	// ----------------------------------------------------

	/**
	 * Synchronously checks if a content type (entity) is registered
	 * in the currently active tenant's configuration map.
	 */
	checkEntityExistence(contentType: string): boolean {
		const configs = this.context.entityConfigs();
		return !!configs?.has(contentType);
	}

	/**
	 * Asynchronously loads, resolves, and caches a specific entity configuration.
	 * @returns MikaEntityConfig or null if not found.
	 */
	async getConfig(contentType: string): Promise<MikaEntityConfig | null> {

		const app = this.context.getActiveApp();

		if (!app || !this.checkEntityExistence(contentType)) return null;

		const cacheKey = `${app?.appId}-${contentType}`;

		const cached = this.runtimeCache.get(cacheKey);
		if (cached) return cached;

		const raw = this.getEntityConfig(contentType);
		let config: MikaEntityConfig;

		if (typeof raw === 'function') {
			const resolved = await executeWithContextFallback(raw, this.injector);

			if (!resolved || typeof resolved !== 'object') {
				throw new Error(`[MikaEntity] Function config for "${contentType}" is invalid or returned nothing.`);
			}

			if ((resolved as any).__normalized) {
				config = resolved as MikaEntityConfig;
			} else {
				config = normalizeEntityConfig(resolved);
				(config as any).__normalized = true;
			}

		} else if (typeof raw === 'object' && raw !== null) {
			config = normalizeEntityConfig(raw);
		} else {
			return null;
		}

		this.runtimeCache.set(cacheKey, config);
		return config;
	}

	getEntityConfig(contentType: string): any {
		const configs = this.context.entityConfigs();
		return configs instanceof Map
			? configs.get(contentType)
			: configs?.[contentType];
	}

	async executeWithFallback(fn: () => any): Promise<any> {
		try {
			return await runInInjectionContext(this.injector, () => fn());
		} catch (err) {
			console.warn('[MikaEntity] Injection context failed, falling back to direct execution', err);
			return await fn(); // ← fallback to raw execution
		}
	}

	// ----------------------------------------------------
	// BASE URL RESOLUTION
	// ----------------------------------------------------

	/**
	 * Resolves the final active API Base URL based on the current tenant and environment.
	 * This is consumed by the HttpInterceptor.
	 */
	activeBaseUrl = computed<string>(() => {
		const app = this.context.getActiveApp();
		if (!app) return '';

		let apiBase = MikaUrlHelper.ensureBase(app?.baseUrls?.apiBaseUrl || '')

		const activeEnv = this.context.activeEnvironment();

		if (activeEnv?.apiBaseUrl) {
			apiBase = MikaUrlHelper.ensureBase(activeEnv.apiBaseUrl);
		}

		return apiBase;

	});

	/**
	 * 🔐 Resolves the required permission claim string for a specific entity action.
	 * Checks the custom map first, then falls back to the default convention.
	 * @param config The resolved MikaEntityConfig for the current entity.
	 * @param action The internal action being checked (e.g., EMikaAction.CREATE).
	 * @returns The exact claim string required in the user's permissions list.
	 */
	resolveRequiredClaim(config: MikaEntityConfig, action: EMikaAction): string {
		const actionString = action.toString(); // e.g., 'READ', 'DELETE'

		// 1. Check for Custom Override Claim
		const customClaim = config.permissions?.requiredClaims?.[actionString];
		if (customClaim) {
			return customClaim;
		}

		// 2. Determine the Standard Claim Name
		let standardAction: string;

		// Map internal display actions (SHOW, VIEW) to standard REST actions (READ)
		switch (action) {
			case EMikaAction.SHOW:
			case EMikaAction.LOAD:
				standardAction = 'read';
				break;
			case EMikaAction.SAVE:
				standardAction = 'update'; // Assuming SAVE covers both create/update
				break;
			case EMikaAction.CREATE:
				standardAction = 'create';
				break;
			case EMikaAction.DELETE:
				standardAction = 'delete';
				break;
			default:
				// Fallback for custom actions (e.g., APPROVE, REJECT)
				standardAction = actionString.toLowerCase();
				break;
		}

		// 3. Assemble the Default Claim: [contentType]:[action]
		// Example: 'posts:read'
		const contentTypeSlug = config.contentType.toLowerCase();
		return `${contentTypeSlug}:${standardAction}`;
	}
}
