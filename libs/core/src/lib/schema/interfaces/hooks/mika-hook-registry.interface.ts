import { FormGroup } from "@angular/forms";
import { MikaHookContext } from "./mika-hook-context.interface";

export interface MikaHookRegistry {
	onSubmit?: (formData: any, context: MikaHookContext) => Promise<any> | any;
	onSubmitTransform?: (formData: any, context: MikaHookContext) => any;
	onSuccess?: (response: any, context: MikaHookContext) => void | Promise<void>;
	onError?: (error: any, context: MikaHookContext) => void | Promise<void>;
	submitHandler?: (form: FormGroup, context: MikaHookContext) => void | Promise<void>;
	// add more hooks here
}
