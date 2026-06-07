import { Injectable, inject, Injector } from '@angular/core';
import { MikaContextService } from '..';
import { MikaDashboardConfig, MikaWidgetConfig } from '../../interfaces';
import { executeWithContextFallback } from '../../utils';
import { generateDefaultDashboard } from '../../config/mika-dashboard.config';

@Injectable({ providedIn: 'root' })
export class MikaDashboardService {

	private context = inject(MikaContextService);
	private injector = inject(Injector);

	/** In-memory cache of resolved dashboards (id -> config) */
	private cache = new Map<string, MikaDashboardConfig>();

	/** Simple flag to indicate whether cache is primed */
	private cachePrimed = false;

	/**
	 * Public: returns dashboards, resolving factory functions inside DI context.
	 * Uses in-memory cache unless `forceReload` is true.
	 */
	async getDashboards(forceReload = false): Promise<MikaDashboardConfig[]> {
		if (!forceReload && this.cachePrimed) {
			return this.sortedCache();
		}

		// Read user-provided dashboards from context (do not mutate them)
		const rawDashboards = this.context.dashboards() ?? [];

		const resolvedList: MikaDashboardConfig[] = [];

		// Resolve each raw dashboard (factory or plain object)
		for (const raw of rawDashboards) {
			const resolved = await this.getConfig(raw);
			if (resolved) resolvedList.push(resolved);
		}

		// Resolve default dashboard factory (but prefer user-provided dashboard with same id)
		const defaultDashResolved = await this.getConfig(generateDefaultDashboard);
		if (defaultDashResolved) {
			// If user provided a dashboard with same id, prefer user one (so we don't duplicate)
			const hasUserOverride = resolvedList.some(d => d.id === defaultDashResolved.id);
			if (!hasUserOverride) resolvedList.push(defaultDashResolved);
		}

		// Clear + repopulate cache
		this.cache.clear();
		for (const d of resolvedList) {
			if (!d.id) {
				console.warn('[MikaDashboard] Dashboard is missing an `id` property and will be skipped.', d);
				continue;
			}
			if (this.cache.has(d.id)) {
				console.warn(`[MikaDashboard] Duplicate dashboard id "${d.id}" found — keeping first occurrence.`);
				continue;
			}
			this.cache.set(d.id, d);
		}

		this.cachePrimed = true;
		return this.sortedCache();
	}

	/** Force re-resolution (clears cache and reloads factories) */
	async refresh(): Promise<MikaDashboardConfig[]> {
		this.cachePrimed = false;
		this.cache.clear();
		return this.getDashboards(true);
	}

	/** Invalidate cache without fetching */
	invalidate(): void {
		this.cachePrimed = false;
		this.cache.clear();
	}

	/** Returns sorted list from the cache */
	private sortedCache(): MikaDashboardConfig[] {
		return Array.from(this.cache.values()).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
	}

	/**
	 * Resolve a single dashboard config:
	 * - Accepts factory function (sync/async) or plain object
	 * - Ensures widget-level factory functions execute inside DI context as well
	 * - Marks resolved object with __normalized to avoid double-work
	 */
	async getConfig(rawConfig: any): Promise<MikaDashboardConfig | null> {
		if (!rawConfig) return null;

		// If the rawConfig itself is already a resolved dashboard instance that we returned earlier,
		// we can return it immediately to avoid repeated resolution.
		if (typeof rawConfig === 'object' && (rawConfig as any).__normalized) {
			return rawConfig as MikaDashboardConfig;
		}

		// CASE 1 — Factory function (async or sync)
		if (typeof rawConfig === 'function') {
			const resolved = await executeWithContextFallback(rawConfig, this.injector);

			if (!resolved || typeof resolved !== 'object') {
				console.error(`[MikaDashboard] Dashboard factory "${rawConfig.name || 'anonymous'}" returned invalid value.`, resolved);
				return null;
			}

			// Ensure widgets inside are resolved (if any are factories)
			await this.resolveWidgetFactories(resolved);

			(resolved as any).__normalized = true;
			return resolved as MikaDashboardConfig;
		}

		// CASE 2 — Plain dashboard object
		if (typeof rawConfig === 'object') {
			// Make sure widget factories are executed inside DI context as well
			await this.resolveWidgetFactories(rawConfig as MikaDashboardConfig);

			(rawConfig as any).__normalized = true;
			return rawConfig as MikaDashboardConfig;
		}

		// Anything else is invalid
		console.warn('[MikaDashboard] Unsupported dashboard config type.', rawConfig);
		return null;
	}

	/** Execute widget-level dataSource/component factories inside DI context where needed */
	private async resolveWidgetFactories(dashboard: MikaDashboardConfig): Promise<void> {
	if (!Array.isArray(dashboard.groups)) return;

	for (const group of dashboard.groups) {
		if (!Array.isArray(group.widgets)) continue;

		for (const widget of group.widgets) {
			// Skip already normalized widgets
			if ((widget as any).__normalized) continue;

			// Resolve component factory if present
			if (typeof (widget as any).component === 'function' && !(widget as any).component.prototype) {
				try {
					const resolvedComp = await executeWithContextFallback(
						() => Promise.resolve((widget as any).component()),
						this.injector
					);
					(widget as any).component = resolvedComp;
				} catch (err) {
					console.warn(`[MikaDashboard] Failed to resolve widget.component factory for widget "${widget.id}"`, err);
				}
			}

			// Resolve dataSourceFn factory if flagged
			if (typeof widget.dataSourceFn === 'function' && (widget.dataSourceFn as any).__isFactory) {
				try {
					const resolved = await executeWithContextFallback(
						() => Promise.resolve((widget.dataSourceFn as any)()),
						this.injector
					);
					if (typeof resolved === 'function') {
						widget.dataSourceFn = resolved;
					}
				} catch (err) {
					console.warn(`[MikaDashboard] Failed to resolve widget.dataSourceFn factory for widget "${widget.id}"`, err);
				}
			}

			(widget as any).__normalized = true;
		}
	}
}

}
