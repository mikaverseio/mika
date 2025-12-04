import { FormField } from "./form-field.interface";

export interface FilterConfig extends FormField {
    /**
     * Key to use for localization
     */
    localizeKey?: string;
}
