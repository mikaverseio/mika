export interface SidebarItem {
	key?: string;
	label: string;
	route?: string;
	icon?: string;
	order?: number;
	external?: boolean;
	divider?: boolean;
	children?: SidebarItem[];
}
