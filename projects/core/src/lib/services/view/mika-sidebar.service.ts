import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { MikaSidebarGroupConfig } from '../../interfaces/sidebar/mika-sidebar-group-config.interface';
import { from, switchMap, tap } from 'rxjs';
import { MikaContextService } from '../engine/mika-context.service';
import { MikaConfigService } from '../engine/mika-config.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MikaAuthService } from '../auth/mika-auth.service';

@Injectable({ providedIn: 'root' })
export class MikaSidebarService {

	private context = inject(MikaContextService);
	private config = inject(MikaConfigService);
	private auth = inject(MikaAuthService);

	menus = signal(new Array<MikaSidebarGroupConfig>);

	constructor() {
		this.context.contextChange$
        .pipe(
            takeUntilDestroyed(inject(DestroyRef)),
            tap(appId => console.log(`[SidebarService] Context change detected for: ${appId}. Starting sidebar render.`)),
            switchMap((appId) => from(this.renderSidebar())),
            tap(() => console.log(`[SidebarService] Sidebar rendered successfully.`))
        )
        .subscribe({
            error: (err: any) => console.error('[SidebarService] Failed to render sidebar:', err)
        });
	}

	async renderSidebar(tenantSidebarGroups?: MikaSidebarGroupConfig[]): Promise<MikaSidebarGroupConfig[]> {
		const settings = this.context.getActiveApp()?.settings;
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

		for (const [key, config] of this.context.entityConfigs().entries()) {
			// NOTE: We rely on MikaConfigService to resolve the config (async)
			const resolved = await this.config.getConfig(key);

			// Check if config exists or resolved successfully (it returns null if not found)
            if (!resolved) {
                continue;
            }

			const sidebarConfig = resolved?.sidebarConfig;

			// 1. Basic Visibility Check
            if (sidebarConfig?.hidden || sidebarConfig?.showInSidebar === false) {
                continue;
            }

			// Default permission required to see the list is 'view' or 'read'
            const requiredPermission = 'read';

			if (!this.auth.hasPermission(requiredPermission)) {
                // User lacks permission for this entity, skip rendering the menu item.
                continue;
            }

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
