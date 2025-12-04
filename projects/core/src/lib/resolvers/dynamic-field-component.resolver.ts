import { inject, Inject, Injectable, Type } from "@angular/core";
import { fieldTypeMap } from "../fields/field-type-map";
import { MIKA_FIELD_COMPONENT_OVERRIDES } from "../tokens/mika.tokens";
import { MikaFieldType } from "../types/mika-app.type";

@Injectable({ providedIn: 'root' })
export class DynamicFieldComponentResolver {
	resolveComponent(type: string): Type<any> | null {
		const overrides = (inject(MIKA_FIELD_COMPONENT_OVERRIDES, { optional: true }) ?? []) as Record<string, Type<any>>[];


		for (const overrideMap of overrides) {
			if (overrideMap[type]) return overrideMap[type];
		}

		return fieldTypeMap[type as MikaFieldType] ?? null;
	}
}
