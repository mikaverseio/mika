import { inject, Type } from "@angular/core";
import { MikaContextService } from "../services";
import { MikaDashboardConfig, MikaWidgetConfig } from "../interfaces";
import { MikaStatCardComponent } from "../components/dashboard/mika-stat-card.component";

export function generateDefaultDashboard(): MikaDashboardConfig {

		const context = inject(MikaContextService);

		// 1. Get all registered entities from the active app context
		const entities = context.entityConfigs();

		const widgets: MikaWidgetConfig[] = [];

		// 2. Add System Health Widget (Total Apps Count)
		widgets.push({
			id: 'mika-system-status',
			title: 'Registered Apps',
			type: 'stat-card',
			size: 'col-span-1',
			entitySlug: 'mika_system_apps', // Pseudo-slug for internal stats (e.g., in MikaDataService)
			options: { order: 1 }
		});

		// 3. Generate a Stat Card for every registered entity (e.g., Total Posts, Total Books)
		const entityWidgets: MikaWidgetConfig[] = Object.keys(entities || {}).map((slug, index) => ({
			id: `stat-${slug}`,
			title: `Total ${slug}`,
			type: 'stat-card',
			size: 'col-span-1',
			entitySlug: slug,
			options: { order: index + 2 } // Start order after system widget
		}));

		widgets.push(...entityWidgets);

		// 4. Add Recent Activity List (Requires at least one entity to exist)
		if (entityWidgets.length > 0) {
			// Target the first registered entity's slug for the recent activity list
			const primaryEntitySlug = Object.keys(entities || {})[0];

			widgets.push({
				id: 'recent-activity',
				title: `Recent ${primaryEntitySlug} Activity`,
				type: 'recent-list', // Assumes a component for this is available
				size: 'col-span-full', // Take full width below the stat cards
				entitySlug: primaryEntitySlug,
				options: { limit: 5 }
			});
		}

		// 5. Define the fallback widgets list for when there are NO entities registered at all
		const fallbackWidgets: MikaWidgetConfig[] = [{
			id: 'welcome',
			title: 'Welcome to Mika',
			type: 'custom-comp',
			size: 'col-span-full',
			// The component placeholder must be supplied here.
			component: MikaStatCardComponent as Type<any>
		} as MikaWidgetConfig];

		// 6. Return the final MikaDashboardConfig
		return {
			id: 'system-overview',
			label: 'System Overview',
			order: 10,
			layout: 'grid-2-col', // Or use the CSS grid class 'grid-default'

			// Return the generated widgets if there's data, otherwise return the static fallback
			widgets: widgets.length > 0 ? widgets : fallbackWidgets
		};
	}
