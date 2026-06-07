
import { MikaGlobalEntityConfig } from "../entity/mika-global-entity-config.interface";
import { MikaLocalizationConfig } from "../entity/mika-localization-config.interface";
import { MikaPreloadConfig } from "../entity/mika-preload-config.interface";
import { MikaSidebarGroupConfig } from "../sidebar/mika-sidebar-group-config.interface";

export interface MikaGlobalConfig {
	siteName: string;

	sidebarMode?: 'auto' | 'manual';

	sidebarGroups?: MikaSidebarGroupConfig[];

	globalEntityConfig?: MikaGlobalEntityConfig;

	preload?: MikaPreloadConfig[];

	languages?: MikaLocalizationConfig;

	noAuth?: boolean;

	enableAuditLogs?: boolean;
}
