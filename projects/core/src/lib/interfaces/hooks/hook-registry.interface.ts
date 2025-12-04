import { FormGroup } from "@angular/forms";
import { HookContext } from "./hook-context.interface";

export interface HookRegistry {
	onSubmit?: (formData: any, context: HookContext) => Promise<any> | any;
	onSubmitTransform?: (formData: any, context: HookContext) => any;
	onSuccess?: (response: any, context: HookContext) => void | Promise<void>;
	onError?: (error: any, context: HookContext) => void | Promise<void>;
	submitHandler?: (form: FormGroup, context: HookContext) => void | Promise<void>;
	// add more hooks here
}
