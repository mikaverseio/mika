import { inject } from '@angular/core';
import { MikaContextService } from '../../services';
import { MikaDashboardConfig, MikaWidgetConfig } from '../interfaces';

/**
 * Default dashboard definition — UI-neutral.
 * Provides data (ids, titles, data sources) but leaves widget rendering to UI registries.
 */
export function generateDefaultDashboard(): MikaDashboardConfig {
  const context = inject(MikaContextService);
  const entities = context.entityConfigs();
  const widgets: MikaWidgetConfig[] = [];

  const addStat = (id: string, title: string, entitySlug: string, order: number, icon?: string, dataSource?: () => any) => {
    widgets.push({
      id,
      title,
      subTitle: undefined,
      type: 'stat-card',
      size: 'col-span-1',
      entitySlug,
      options: { order },
      icon,
      dataSourceFn: dataSource,
    });
  };

  addStat(
    'mika-system-status',
    'Registered Apps',
    'mika_system_apps',
    1,
    'grid-outline',
    () => context.appsCount()
  );

  addStat(
    'mika-entity-counts',
    'Registered Entities',
    'mika_system_entities',
    2,
    'documents-outline',
    () => context.totalEntityCount()
  );

  addStat(
    'mika-active-app',
    'Active App',
    'mika_active_app',
    3,
    'checkmark-done-circle-outline',
    () => context.getActiveApp()?.appId
  );

  addStat(
    'mika-active-env',
    'Active Environment',
    'mika_active_env',
    4,
    'code-outline',
    () => context.activeEnvironment()?.name
  );

  const entityWidgets: MikaWidgetConfig[] = Object.keys(entities || {}).map((slug, index) => ({
    id: `stat-${slug}`,
    title: `Total ${slug}`,
    type: 'stat-card',
    size: 'col-span-1',
    entitySlug: slug,
    options: { order: index + 10 },
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
      options: { limit: 5, order: 100 },
    });
  }

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
        widgets: widgets,
      },
    ],
  };
}
