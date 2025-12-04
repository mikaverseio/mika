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


export interface EntityConfigV0 extends MikaHookRegistry {
    /**
     * Base URL for API requests related to this entity.  If provided,
     * it will be prepended to other endpoint properties (e.g., `endpoint`,
     * `postEndpoint`).
     */
    apiBase?: string;

    /**
     * Identifier for a specific content item.  This is typically used
     * when loading or editing a single entity.  It can be a string or a number.
     */
    contentId?: string | number;

    /**
     * The type of content this entity represents (e.g., 'article', 'product',
     * 'user').  This is a *required* property and is often used in API
     * requests or internal logic.
     */
    contentType: string;

    /**
     * The singular form of the entity name (e.g., 'article' for 'articles').
     * This is used for labels and messages.
     */
    singular?: string;

    /**
     * The primary endpoint for fetching a list of entities (e.g.,
     * '/api/articles').  This is used for table views and data retrieval.
     */
    endpoint: string;

    /**
     * The endpoint for creating new entities (e.g., '/api/articles').
     * If not provided, the `endpoint` will be used for POST requests.
     */
    postEndpoint?: string;

    /**
     * The endpoint for editing existing entities (e.g., '/api/articles/{id}').
     * If not provided, the `endpoint` with a contentId will be used for
     * PUT/PATCH requests.
     */
    editEndpoint?: string;

    /**
      * Endpoint to fetch all results, bypassing pagination. Useful for exports
      */
    allResultsEndpoint?: string;

    /**
     * Parameter name to use with allResultsEndpoint
     */
    allResultsParam?: string;

    /**
     * The title to display for this entity (e.g., 'Articles', 'Products').
     * This is used in UI elements like page headers.
     */
    title?: string;

    /**
     * Configuration for the columns to display in a table view of this entity.
     * Each `TableColumn` defines how a specific data field should be rendered
     * in the table.
     */
    tableColumns: MikaColumnConfig[];

    /**
     * The column to use as the unique identifier for each row in the table.
     * This can be either the column name or the property name.
     */
    tableIdColumn?: string | number;

    /**
     * Configuration for the fields to display in a form for creating or
     * editing this entity.  Each `FormField` defines the input type, validation
     * rules, and display properties for a form field.
     */
    formFields: MikaFieldConfig[];

    /**
     * The default field to sort the table by.
     */
    defaultSort?: string;

    /**
     * Determines whether to show default action buttons (edit, delete) in the table.
     */
    showActions?: boolean;

    /**
     * Custom actions that can be performed on individual entities in the table.
     * This allows you to add buttons or links for custom operations.
     */
    actions?: MikaEntityActionMap;

    /**
     * Configuration for actions that can be performed on multiple selected
     * entities in the table (e.g., 'delete selected').
     */
    bulkActions?: any;

    /**
     * Enables sorting of table columns.
     */
    sortable?: boolean;

    /**
     * Configuration for filtering the entity list.  Each `FilterConfig`
     * defines a filter field and its options.
     */
    filters?: Array<MikaFilterConfig>;

     /**
     * Determines when filters are applied.
     * 'onChange': Apply filters whenever a filter value changes.
     * 'onSubmit': Apply filters only when a submit button is clicked.
     * null: No specific filter submit mode.
     */
    filterSubmitMode?: 'onChange' | 'onSubmit' | null;

    /**
     * Indicates whether the form for creating/editing this entity should be
     * displayed in a step-by-step wizard format.
     */
    steppedForm?: boolean;

    /**
     * Determines whether to render the table header.
     */
    renderHeader?: boolean;

    /**
     * Configuration for the sidebar associated with this entity's views.
     * This allows you to customize the content and behavior of the sidebar.
     */
    sidebarConfig?: MikaSidebarEntityConfig;

    /**
     * Configuration for toolbar items in the sidebar.
     */
    sidebarToolbarItems?: MikaToolbarConfig[];

    /**
     * Array of custom form components.
     */
    formComponents?: Array<MikaFormComponentConfig>;

    /**
     * Property in the API response that indicates success.
     */
    responseSuccessProp?: string;

    /**
     * Enables caching of API requests for this entity.
     */
    cacheRequests?: boolean;

     /**
     * Indicates whether this entity supports localization.
     */
    localizable?: boolean;

    /**
     * Available locales for this entity.
     */
    locales?: Array<string>;

    /**
      * Configuration for how properties are nested in the response
      */
    responseProps?: MikaResponseConfig;

    /**
     * Configuration for preloading data.
     */
    preload?: MikaPreloadConfig;

    /**
     * Automatically generate ID
     */
    generateId?: boolean;

    /**
     * Use local storage
     */
    useLocalStorage?: boolean;

    /**
     * Key to use in local storage
     */
    localStorageKey?: string;

    /**
     * Configuration related to forms.
     */
    formConfig?: MikaFormConfig;

	permissions?: MikaEntityPermissionsConfig;
}
