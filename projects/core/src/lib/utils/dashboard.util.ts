import { MikaDashboardGroup, MikaWidgetConfig } from "../interfaces";

export function getGroupGridLayout(group: MikaDashboardGroup): string {
	if (group.customGridTemplate) {
		return group.customGridTemplate;
	}

	const baseClass = 'group-grid';
	const defaultGap = 'grid-gap-3'; // 15px default gap

	switch (group.layout) {
		case 'grid-1': return `${baseClass} grid-cols-1 ${defaultGap}`;
		case 'grid-2': return `${baseClass} grid-cols-2 ${defaultGap}`;
		case 'grid-3': return `${baseClass} grid-cols-3 ${defaultGap}`;
		case 'grid-4': return `${baseClass} grid-cols-4 ${defaultGap}`;
		case 'auto': return `${baseClass} grid-cols-auto ${defaultGap}`;
		default: return `${baseClass} grid-cols-1 ${defaultGap}`;
	}
}

export function getWidgetSize(widget: MikaWidgetConfig): string {
	if (!widget?.size) return 'col-span-1';
	switch (widget.size) {
		case 'small':
			return 'col-span-1';
		case 'medium':
			return 'md:col-span-2';
		case 'large':
			return 'md:col-span-3';
		default:
			// Accept custom strings like 'col-span-1'
			return widget.size;
	}
}
