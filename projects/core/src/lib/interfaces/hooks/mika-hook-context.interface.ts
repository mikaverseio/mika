import { FormGroup } from "@angular/forms";
import { MikaEntityConfig } from "../entity/mika-entity-config.interface";

export interface MikaHookContext {
	config: MikaEntityConfig;
	form?: FormGroup;
	mode?: 'create' | 'edit';
	id?: number;
}
