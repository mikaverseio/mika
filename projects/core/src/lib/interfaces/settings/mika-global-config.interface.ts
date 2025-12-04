
import { MikaResponseConfig } from "../entity/mika-response-config.interface";
import { MikaGlobalEntityConfig } from "../entity/mika-global-entity-config.interface";
import { MikaLocalizationConfig } from "../entity/mika-localization-config.interface";
import { MikaPreloadConfig } from "../entity/mika-preload-config.interface";
import { MikaAuthConfig } from "../core/mika-app-config.interface";
import { MikaSidebarGroupConfig } from "../sidebar/mika-sidebar-group-config.interface";

export interface MikaGlobalConfig {
	// remove
	// authConfig?: MikaAuthConfig;
	// remove
	environments?: any;

	siteName: string;

	//remove - now availbe in baseUrls
	// apiBase: string;
	//remove - now availbe in baseUrls
	mediaBaseUrl?: string;
	//remove - now availbe in baseUrls
	publicSiteUrl?: string;

	//move to theming
	logo?: string;

	// remove
	actions?: {
		notifications: boolean;
		messages: boolean;
		[customAction: string]: boolean;
	};


	sidebarMode?: 'auto' | 'manual';

	// remove
	sidebarMenu?: MikaSidebarGroupConfig[];


	sidebarGroups?: MikaSidebarGroupConfig[];

	globalEntityConfig?: MikaGlobalEntityConfig;

	// remove
	preload?: MikaPreloadConfig[];

	// remove
	localizeAllEntities?: boolean;

	// remove
	localizeDashboad?: boolean;

	languages?: MikaLocalizationConfig;

	// move to globalEntitySettings
	responseProps?: MikaResponseConfig;


	enableAuditLogs?: boolean;
}
