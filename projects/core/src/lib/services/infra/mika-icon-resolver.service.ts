// projects/core/src/lib/services/infra/mika-icon-resolver.service.ts
import { Injectable, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import * as ionIcons from 'ionicons/icons'; // Import ALL icons dynamically
import { MikaContextService } from '../engine/mika-context.service';
import { MikaConfigService } from '../engine/mika-config.service';
import { kebabToCamelCase } from '../../utils';
import { MikaLoggerService } from './mika-logger.service';

// List of icons the engine MUST include for core UI/System
const CORE_SYSTEM_ICONS: Record<string, any> = {
    // Basic UI and Navigation
    'apps': ionIcons.apps,
    'apps-outline': ionIcons.appsOutline,
    'grid-outline': ionIcons.gridOutline,
    'document-outline': ionIcons.documentOutline,
    'document-text-outline': ionIcons.documentTextOutline,
    'ellipsis-vertical': ionIcons.ellipsisVertical,
    'ellipsis-vertical-sharp': ionIcons.ellipsisVerticalSharp,
    'ellipsis-vertical-circle-sharp': ionIcons.ellipsisVerticalCircleSharp,
    'ellipsis-horizontal-circle-sharp': ionIcons.ellipsisHorizontalCircleSharp,
    'list-circle': ionIcons.listCircle,
    'ellipse-outline': ionIcons.ellipseOutline, // Fallback icon
    'open-outline': ionIcons.openOutline,
    'home-outline': ionIcons.homeOutline,
    "settings-outline": ionIcons.settingsOutline,
    "notifications-outline": ionIcons.notificationsOutline,
    "mail-outline": ionIcons.mailOutline,

    // Actions (CRUD, Save/Cancel, Workflow)
    'save-outline': ionIcons.saveOutline,
    'trash-outline': ionIcons.trashOutline,
    'trash': ionIcons.trash,
    'add-circle': ionIcons.addCircle,
    'create-outline': ionIcons.createOutline,
    'create': ionIcons.create,
    'close-outline': ionIcons.closeOutline,
    'close': ionIcons.close,
    'close-circle': ionIcons.closeCircle,
    'close-circle-outline': ionIcons.closeCircleOutline,
    'checkmark-outline': ionIcons.checkmarkOutline,
    'construct-outline': ionIcons.constructOutline, // Settings/Tooling
    'eye': ionIcons.eye,

    // Auth & Status (Critical)
    'log-in': ionIcons.logIn,
    'log-out': ionIcons.logOut,
	'log-in-outline': ionIcons.logInOutline,
    'log-out-outline': ionIcons.logOutOutline,
    'rocket': ionIcons.rocket, // For PROD
    'rocket-outline': ionIcons.rocketOutline,

    // Data & Filtering
    'filter-circle': ionIcons.filterCircle,
    'filter-circle-outline': ionIcons.filterCircleOutline,
    'reload-circle': ionIcons.reloadCircle,
    'reload-outline': ionIcons.reloadOutline,
    'refresh-circle': ionIcons.refreshCircle,
    'swap-vertical': ionIcons.swapVertical,
    'arrow-down-circle': ionIcons.arrowDownCircle,
    'download-outline': ionIcons.downloadOutline,
    'cloud-download-outline': ionIcons.cloudDownloadOutline, // Specific download variant
    'print': ionIcons.print,

    // Specific & Custom
    'link': ionIcons.link,
    'code-slash-outline': ionIcons.codeSlashOutline,
    'copy-outline': ionIcons.copyOutline,
    'book-outline': ionIcons.bookOutline,
    'logo-discord': ionIcons.logoDiscord,
    'cloud-upload': ionIcons.cloudUpload,
    'cloud-download': ionIcons.cloudDownload,
	'swap-horizontal-outline': ionIcons.swapHorizontalOutline
};

@Injectable({ providedIn: 'root' })
export class MikaIconResolverService {
    private context = inject(MikaContextService);
	private config = inject(MikaConfigService);
	private logger = inject(MikaLoggerService);

    private registeredIconCache = new Set<string>();

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
        const iconRegistry: Record<string, any> = {};

        for (const app of apps) {
            const iconKeys = new Set<string>();

            app.settings?.sidebarGroups?.forEach(group => {
                group.items?.forEach(item => {
                    if (item.icon) iconKeys.add(item.icon);
                });
            });


			for (const [key, config] of app.entities) {
				const resolved = await this.config.getConfig(key);

				if (resolved?.sidebarConfig?.icon) {
                    iconKeys.add(resolved.sidebarConfig.icon);
                }
			}

            iconKeys.forEach(kebabIconName => {
                if (this.registeredIconCache.has(kebabIconName)) return;

                const name = kebabToCamelCase(kebabIconName);

                const iconValue = (ionIcons as any)[name];

                if (iconValue) {
                    iconRegistry[kebabIconName] = iconValue;
                    this.registeredIconCache.add(kebabIconName);
                } else {
                    this.logger.warn('MikaIcon',`[MikaIcon] Configured icon '${kebabIconName}' not found in ionicons exports.`);
                }
            });
        }

        // Register all newly found icons with Ionicons global registry
        if (Object.keys(iconRegistry).length > 0) {
            addIcons(iconRegistry);
            this.logger.info('MikaIcon', `Registered ${Object.keys(iconRegistry).length} custom icons from configuration.`);
        }
    }
}
