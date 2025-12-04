
import { ResponseProps } from "../entity/entity-table-response.interface";
import { GlobalEntityConfig } from "../entity/globla-entity-config.interface";
import { MikaContentLocalizationSettings } from "../entity/mika-language.interface";
import { MikaPreloadConfig } from "../entity/preload-config.interface";
import { MikaAuthConfig } from "../mika-app-config.interface";
import { SidebarGroup } from "../sidebar/sidebar-group.interface";

export interface MikaGlobalSettings {
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
	sidebarMenu?: SidebarGroup[];


	sidebarGroups?: SidebarGroup[];

	globalEntityConfig?: GlobalEntityConfig;

	// remove
	preload?: MikaPreloadConfig[];

	// remove
	localizeAllEntities?: boolean;

	// remove
	localizeDashboad?: boolean;

	languages?: MikaContentLocalizationSettings;

	// move to globalEntitySettings
	responseProps?: ResponseProps;


	enableAuditLogs?: boolean;
}
