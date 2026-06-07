import { Type } from "@angular/core";

/**
 * Defines a single tab/view within the dashboard container.
 */
export interface MikaDashboardConfig {
    /** The unique identifier for this dashboard tab. e.g., 'system-overview' */
    id: string;

    /** The display label for the tab or page header. e.g., 'System Overview' */
    label: string;

	icon?: string;

    /** Determines the order of the tab relative to other dashboards. */
    order?: number;

	default?: boolean;

	groups?: MikaDashboardGroup[];

}

export interface MikaDashboardGroup {
	id: string;
	label?: string;
	icon?: string;
	layout?: 'grid-1' | 'grid-2' | 'grid-3' | 'grid-4' | 'auto' | string;
	customGridTemplate?: string;
	widgets?: MikaWidgetConfig[];
	components?: any[];
	collapsible?: boolean;
	collapsed?: boolean;
	order?: number;
	permissions?: string[];
}

/**
 * Defines a single card/component unit within the dashboard layout.
 */
export interface MikaWidgetConfig {
    /** Unique instance ID for this specific widget instance. */
    id: string;

    /** Title displayed in the widget card header. */
    title: string;

	icon?: string;

	subTitle?: string;

	teaser?: string;

    /** The type of widget component to render. */
    type: 'stat-card' | 'recent-list' | 'chart-bar' | 'chart-line' | 'custom-comp' | 'stat-list-card';

    /** * The size/span the widget should take in the CSS grid layout.
     * @example 'col-span-1', 'col-span-2', or simple 'medium'.
     */
    size?: 'small' | 'medium' | 'large' | string;

    /** The slug of the primary entity this widget fetches data from (e.g., 'posts'). */
    entitySlug?: string;

	 /** Optional: The custom Angular component to load for type='custom'. */
    component?: Type<any>;

    /** Configuration specific to the widget type (e.g., API query params, chart colors). */
    options?: Record<string, any>;

	/** Custom, asynchronous function to retrieve the metric data.
     * Overrides the standard entitySlug API call.
     * @returns A promise that resolves to the final number or object.
     */
	dataSourceFn?: () => Promise<any>;
}
