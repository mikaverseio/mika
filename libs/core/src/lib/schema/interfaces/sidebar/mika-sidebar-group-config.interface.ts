import { MikaSidebarItemConfig } from "./mika-sidebar-item-config.interface";

export interface MikaSidebarGroupConfig {
	key: string;
	label: string;                   // Optional label for the group
	order?: number;                   // Optional sort order
	icon?: string;                    // Optional group icon
	items?: MikaSidebarItemConfig[];            // Child items
}
