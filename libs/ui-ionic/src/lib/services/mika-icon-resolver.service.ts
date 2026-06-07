// projects/core/src/lib/services/infra/mika-icon-resolver.service.ts
import { Injectable, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import * as ionIcons from 'ionicons/icons'; // Import ALL icons dynamically
import { MikaContextService } from '@mikaverse/core';
import { extractAppIcons, kebabToCamelCase } from '@mikaverse/core';
import { MikaLoggerService } from '@mikaverse/core';
import { CORE_SYSTEM_ICONS } from '../constants/core-system-icons';

// List of icons the engine MUST include for core UI/System


@Injectable({ providedIn: 'root' })
export class MikaIconResolverService {
    private context = inject(MikaContextService);
	private logger = inject(MikaLoggerService);

    private registered = new Set<string>();

    constructor() {
        // Register core system icons once
        addIcons(CORE_SYSTEM_ICONS);
    }

    /**
     * Scans all loaded app configurations to find unique icon strings
     * and registers them with Ionicons dynamically.
     */
    async registerConfigIcons() {
        const apps = this.context.getAllApps();

		const iconKeys = new Set<string>();

		for (const app of apps) {
            const appIcons = extractAppIcons(app);
            appIcons.forEach(icon => iconKeys.add(icon));
        }

		const registry: Record<string, any> = {};

		for (const kebab of iconKeys) {
            if (this.registered.has(kebab)) continue;

            const camel = kebabToCamelCase(kebab);
            const iconValue = (ionIcons as any)[camel];

            if (iconValue) {
                registry[kebab] = iconValue;
                this.registered.add(kebab);
            } else {
                this.logger.warn('MikaIcon', `Icon '${kebab}' not found in Ionicons.`);
            }
        }

		if (Object.keys(registry).length > 0) {
            addIcons(registry);
            this.logger.info('MikaIcon', `Registered ${Object.keys(registry).length} configuration icons.`);
        }

		console.log('---- done icon registry ----');

    }
}
