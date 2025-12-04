import { Type } from "@angular/core";
import { FormGroup } from "@angular/forms";

export interface MikaFormComponentConfig {
	component: Type<any>;
	label: string;
	tab?: string;
	position?: 'top' | 'bottom' | 'after-group' | 'custom' | 'tabbed';
	groupKey?: string;
	inputs?: Record<string, any>;
	mode: 'edit' | 'create' | 'all';
	renderIf?: string | Function
}
