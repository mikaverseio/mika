import { Injectable, Type } from '@angular/core';
import { MikaWidgetConfig } from '../../interfaces';
import { MikaStatCardComponent } from '../../components/dashboard/mika-stat-card.component';
import { MikaRecentCardComponent } from '../../components/dashboard/mika-recent-card.component';
import { MikaBarChartCardComponent } from '../../components/dashboard/mika-barchart-card.component';
import { MikaLineChartCardComponent } from '../../components/dashboard/mika-linechart-card.component';
import { MikaStatListCardComponent } from '../../components/dashboard/mika-stat-list-card.component';

@Injectable({ providedIn: 'root' })
export class MikaWidgetService {

    // Registry mapping config type to Angular Component Type
    private readonly componentRegistry: Record<MikaWidgetConfig['type'], Type<any>> = {
        'stat-card': MikaStatCardComponent,
        'recent-list': MikaRecentCardComponent,
        'chart-bar': MikaBarChartCardComponent,
        'chart-line': MikaLineChartCardComponent,
		'stat-list-card': MikaStatListCardComponent,
        'custom-comp': null! // This must be provided via config/plugin
    };

    /**
     * Resolves a widget configuration type to its corresponding Angular component.
     */
    resolveWidgetComponent(config: MikaWidgetConfig): Type<any> | null {

        if (config.type === 'custom-comp' && config.component) {
            return config.component;
        }

        const component = this.componentRegistry[config.type];

        if (!component) {
            console.error(`[MikaWidget] Component resolver failed for type: ${config.type}`);
        }

        return component;
    }
}
