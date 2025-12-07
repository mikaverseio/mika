import { inject, Type } from "@angular/core";
import { MikaContextService } from "../services";
import { MikaDashboardConfig, MikaWidgetConfig } from "../interfaces";
import { MikaStatCardComponent } from "../components/dashboard/mika-stat-card.component";

export function generateDefaultDashboard(): MikaDashboardConfig {

		const context = inject(MikaContextService);
		const entities = context.entityConfigs();
		const widgets: MikaWidgetConfig[] = [];

		widgets.push({
			id: 'mika-system-status',
			title: 'Registered Apps',
			subTitle: "Number of registered Mika apps",
			type: 'stat-card',
			size: 'col-span-1',
			entitySlug: 'mika_system_apps',
			options: { order: 1 },
			icon: 'grid-outline',
			dataSourceFn: async () => {
				return context.appsCount();
			}
		});

		widgets.push({
			id: 'mika-entity-counts',
			title: 'Registered Entities',
			subTitle: "Total number of registered entities",
			icon: 'documents-outline',
			type: 'stat-card',
			size: 'col-span-1',
			entitySlug: 'mika_system_entities',
			options: { order: 2 },
			dataSourceFn: async () => {
				return context.totalEntityCount();
			}
		});

		widgets.push({
			id: 'mika-active-app',
			title: 'Active App',
			subTitle: "The application currently in use",
			icon: 'checkmark-done-circle-outline',
			type: 'stat-card',
			size: 'col-span-1',
			entitySlug: 'mika_active_app',
			options: { order: 3 },
			dataSourceFn: async () => {
				return context.getActiveApp()?.appId;
			}
		});

		widgets.push({
			id: 'mika-active-env',
			title: 'Active Environment',
			subTitle: "Environment currently used by the system",
			icon: 'code-outline',
			type: 'stat-card',
			size: 'col-span-1',
			entitySlug: 'mika_active_env',
			options: { order: 4 },
			dataSourceFn: async () => {
				return context.activeEnvironment()?.name;
			}
		});

		const entityWidgets: MikaWidgetConfig[] = Object.keys(entities || {}).map((slug, index) => ({
			id: `stat-${slug}`,
			title: `Total ${slug}`,
			type: 'stat-card',
			size: 'col-span-1',
			entitySlug: slug,
			options: { order: index + 2 }
		}));

		widgets.push(...entityWidgets);

		if (entityWidgets.length > 0) {

			const primaryEntitySlug = Object.keys(entities || {})[0];

			widgets.push({
				id: 'recent-activity',
				title: `Recent ${primaryEntitySlug} Activity`,
				type: 'recent-list',
				size: 'col-span-full',
				entitySlug: primaryEntitySlug,
				options: { limit: 5 }
			});
		}


		const fallbackWidgets: MikaWidgetConfig[] = [{
			id: 'welcome',
			title: 'Welcome to Mika',
			type: 'custom-comp',
			size: 'col-span-full',
			component: MikaStatCardComponent as Type<any>
		} as MikaWidgetConfig];


		return {
			id: 'mika-default-dashboard',
			label: 'System Overview',
			order: 10,
			icon: 'stats-chart-outline',
			groups: [
				{
					id: 'stats',
					order: 1,
					layout: 'grid-4',
					widgets: widgets.length > 0 ? widgets : fallbackWidgets
				},
				{
					id: 'stat-list',
					order: 2,
					layout: 'grid-4',
					widgets: [
						{
							id: 'stat-list',
							title: 'Counts',
							type: 'stat-list-card',
							dataSourceFn: async () => {

							}
						},
						{
							id: 'recent-list',
							title: 'Recent',
							type: 'recent-list',
							dataSourceFn: async () => {

							}
						}
					]
				}
			]
		};
	}
