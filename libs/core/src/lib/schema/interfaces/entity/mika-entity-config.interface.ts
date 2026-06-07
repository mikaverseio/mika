import { MikaColumnConfig } from "../table/mika-column-config.interface";
import { MikaEntityActionMap } from "../action/mika-entity-action.interface";
import { MikaSidebarEntityConfig } from "../sidebar/mika-sidebar-entity-config.interface";
import { MikaToolbarConfig } from "../sidebar/mika-toolbar-config.interface";
import { MikaFieldConfig } from "../field/mika-field-config.interface";
import { MikaFilterConfig } from "../field/mika-filter-config.interface";
import { MikaResponseConfig } from "./mika-response-config.interface";
import { MikaHookRegistry } from "../hooks/mika-hook-registry.interface";
import { MikaFormComponentConfig } from "../form/mika-form-component-config.interface";
import { MikaPreloadConfig } from "./mika-preload-config.interface";
import { MikaEntityPermissionsConfig } from "./mika-entity-permission-config.interface";
import { MikaFormConfig } from "../form/mika-form-config.interface";

type CustomEndpoint = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	url: string;
};

export interface MikaEntityConfig extends MikaHookRegistry {
	apiBaseUrl?: string;

	endpoints?: {
		base?: string;
		list?: string;
		get?: string;
		create?: string;
		update?: string;
		delete?: string;
		allResults?: string;
		custom?: Record<string, CustomEndpoint>;
		count?: string;
	};

	request?: {
		params?: any;
		allResultsParam?: string;
		cache?: boolean;
	};

	response?: {
		props?: MikaResponseConfig;
	};

	contentId?: string | number;
	contentType: string;
	singular?: string;
	plural?: string;
	title?: string;

	sidebarConfig?: MikaSidebarEntityConfig;

	template?: 'tabular' | 'form-only' | 'view' | 'custom';

	localizable?: boolean;
	preload?: MikaPreloadConfig;
	generateId?: boolean;
	useLocalStorage?: boolean;
	localStorageKey?: string;

	permissions?: MikaEntityPermissionsConfig;

	table: {
		columns: MikaColumnConfig[];
		idColumn?: string | number;
		defaultSort?: string;
		sortable?: boolean;
		filters?: Array<MikaFilterConfig>;
		filterSubmitMode?: 'onChange' | 'onSubmit' | null;
		mobileColumns?: Array<MikaColumnConfig['key']>;
		recentColumns?: Array<MikaColumnConfig['key']>;
	};

	form: {
		fields: MikaFieldConfig[];
		components?: Array<MikaFormComponentConfig>;
		config?: MikaFormConfig;
	};

	actions: {
		show?: boolean;
		bulk?: any;
		items?: MikaEntityActionMap;
	};
}
