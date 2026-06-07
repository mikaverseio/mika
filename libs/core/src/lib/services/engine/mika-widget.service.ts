import { Injectable, Type } from '@angular/core';
import { MikaWidgetConfig } from '../../schema';

@Injectable({ providedIn: 'root' })
export class MikaWidgetService {

    /**
     * Resolves a widget configuration type to its corresponding Angular component.
     */
    resolveWidgetComponent(config: MikaWidgetConfig): Type<any> | null {

        if (config.type === 'custom-comp' && config.component) {
            return config.component;
        }

        console.error(`[MikaWidget] No built-in component registry in core. Provide component in config.`);
        return null;
    }
}
