// Define the new interface for runtime view overrides

export interface MikaGridRuntimeConfig {
    /**
     * Optional override for whether to display the actions column (e.g., Edit, Delete buttons).
     * If not provided, the value from MikaEntityConfig.actions.show is used.
     */
    showActions?: boolean;

    /**
     * Optional override for whether to enable bulk selection mode.
     * If not provided, the value from MikaEntityConfig.actions.bulk is used.
     */
    bulkMode?: boolean;

    /**
     * Optional override for the set of columns to be visible, ignoring the entity config's defaults.
     * Use this for widgets that only show 2-3 columns.
     * Provide the array of column keys (e.g., ['title', 'dateCreated']).
     */
    visibleColumnKeys?: string[];

    /**
     * Optional flag to disable URL synchronization for this instance,
     * useful for internal widgets that shouldn't affect the browser history.
     */
    disableUrlSync?: boolean;
}

export interface MikaGridState {
	data: any[];
	totalCount: number;
	isLoading: boolean;
	filters: Record<string, any>;
	currentPage: number;
	pageSize: number;
	sortBy: string;
	sortDirection: 'asc' | 'desc';
	isInitialLoad: boolean;
}
