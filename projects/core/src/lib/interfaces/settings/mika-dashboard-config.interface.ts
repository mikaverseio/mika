import { Type } from "@angular/core";

/**
 * Defines a single tab/view within the dashboard container.
 */
export interface MikaDashboardConfig {
    /** The unique identifier for this dashboard tab. e.g., 'system-overview' */
    id: string;

    /** The display label for the tab or page header. e.g., 'System Overview' */
    label: string;

    /** Determines the order of the tab relative to other dashboards. */
    order?: number;

    /** * Defines the overall layout of the widgets in this dashboard.
     * @example 'grid-2-col' (two columns of equal width)
     */
    layout?: 'grid-2-col' | 'grid-3-col' | 'grid-default';

    /** * The array of widgets to be rendered on this specific tab.
     * Replaces the generic 'widgets?: any[]'.
     */
    widgets?: MikaWidgetConfig[];

    /** * Optional custom components injected at the top or bottom of the layout.
     * Retained from your original structure.
     */
    components?: any[];
}

/**
 * Defines a single card/component unit within the dashboard layout.
 */
export interface MikaWidgetConfig {
    /** Unique instance ID for this specific widget instance. */
    id: string;

    /** Title displayed in the widget card header. */
    title: string;

    /** The type of widget component to render. */
    type: 'stat-card' | 'recent-list' | 'chart-bar' | 'chart-line' | 'custom-comp';

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
}
