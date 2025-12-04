import { Type } from "@angular/core";

export interface FormComponentConfig {
	component: Type<any>;
	label?: string;
	tab?: string;
	position?: 'top' | 'bottom' | 'after-group' | 'custom' | 'tabbed';
	groupKey?: string;
	inputs?: Record<string, any>;
	mode: 'edit' | 'create' | 'all';
}
