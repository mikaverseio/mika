import { SidebarItem } from "./sidebar-item.interface";

export interface SidebarGroup {
	key: string;
	label: string;                   // Optional label for the group
	order?: number;                   // Optional sort order
	icon?: string;                    // Optional group icon
	items?: SidebarItem[];            // Child items
}
