import { Injectable, Type, inject } from '@angular/core';
import { MikaWidgetConfig } from '../../interfaces';
import { MikaStatCardComponent } from '../../components/dashboard/mika-stat-card.component';

@Injectable({ providedIn: 'root' })
export class MikaWidgetService {

    // 🛑 Registry mapping config type to Angular Component Type
    private readonly componentRegistry: Record<MikaWidgetConfig['type'], Type<any>> = {
        'stat-card': MikaStatCardComponent,
        'recent-list': MikaStatCardComponent, // Placeholder: Should be a proper list component
        'chart-bar': MikaStatCardComponent,   // Placeholder: Should be a chart component
        'chart-line': MikaStatCardComponent,  // Placeholder
        'custom-comp': null! // This must be provided via config/plugin
    };

    /**
     * Resolves a widget configuration type to its corresponding Angular component.
     */
    resolveWidgetComponent(config: MikaWidgetConfig): Type<any> | null {
		console.log('---resolveWidgetComponent', config);
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
