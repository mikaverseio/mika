import { FormGroup } from "@angular/forms";
import { MikaBaseFieldConfig } from "./base-field.interface";
import { MikaFieldOption } from "./mika-field-option.interface";
import { MikaFieldType } from "../../types/mika-app.type";


export interface MikaFieldConfigV1 extends MikaBaseFieldConfig {
	group?: string;
	type: MikaFieldType;
	defaultValue?: any;
	validators?: any[];

	// Static options
	options?: MikaFieldOption[];
	defaultOption?: MikaFieldOption;

	// Dynamic options (not grouped for now, but clean)
	optionsSource?: string;
	optionsEndpoint?: string;
	optionsQueryParams?: any;
	dependsOn?: string;
	filterByParent?: string;
	loadOptions?: (parentValue?: any) => Promise<MikaFieldOption[]>;
	autocompleteFn?: (search: string) => Promise<MikaFieldOption[]>;
	displayWith?: (option: any) => string;

	// UX & behavior
	placeholder?: string;
	errorText?: string;
	labelPlacement?: string;
	selectInterface?: 'popover' | 'action-sheet' | 'modal';
	accept?: string;
	trueValue?: string;
	falseValue?: string;
	min?: Date;
	slugSource?: string;

	// Conditional logic
	renderIf?: (form: FormGroup) => boolean;

	// Lifecycle
	onInit?: (form: FormGroup) => void;
	onChange?: (form: FormGroup) => void;
	onFocus?: (form: FormGroup) => void;
	onBlur?: (form: FormGroup) => void;

	// Transform
	transformValue?: (value: any) => any;
}

/**
 * Interface representing a form field configuration.
 * This interface defines the structure of a form field configuration object,
 * which is used to create dynamic forms in MikaForm.
 */
export interface MikaFieldConfig extends MikaBaseFieldConfig {
    /**
     * The name of the group this field belongs to.  Fields can be organized into
     * groups for layout or logical purposes within the form.
     */
    group?: string;

    /**
     * The type of form field to render.  This determines the HTML input element
     * or component to use (e.g., 'text', 'select', 'date', 'custom').
     * This is a *required* property.
     */
    type: MikaFieldType;

    /**
     * The default value for the form field.  This value will be used to initialize
     * the field when the form is created.
     */
    defaultValue?: any;

    /**
     * An array of Angular validators to apply to the form field.  Validators
     * define rules for valid input (e.g., required, email format, minimum length).
     */
    validators?: any[];

    /**
     * An array of options for fields that present a list of choices, such as
     * select, radio, or checkbox groups.
     */
    options?: Array<{
        /**
         * The label to display for the option in the UI.
         */
        label: string;
        /**
         * The value associated with the option.  This is the value that will be
         * used when the option is selected.
         */
        value: any;
        /**
         * Indicates whether the option's label is translatable.
         */
        isTranslatable?: boolean;
        /**
         * Indicates whether the option's value is localized
         */
        localizable?: boolean;
    }>;

    /**
      * The default selected option.
      */
    defaultOption?: {
        /**
         * The label to display for the option in the UI.
         */
        label: string;
        /**
         * The value associated with the option.  This is the value that will be
         * used when the option is selected.
         */
        value: any;
        /**
         * Indicates whether the option's label is translatable.
         */
        isTranslatable?: boolean;
    };

    /**
     * A string that identifies where the options for this field should be loaded
     * from.  This could refer to a service or a global configuration.
     */
    optionsSource?: string;

    /**
     * An API endpoint to fetch the options for this field.  This is used for
     * dynamically loading options from a server.
     */
    optionsEndpoint?: string;

    /**
     * Query parameters to include when fetching options from `optionsEndpoint`.
     */
    optionsQueryParams?: any;

    /**
     * The key of another form field that this field depends on.  When the value
     * of the dependent field changes, this field may be updated or re-rendered.
     */
    dependsOn?: string;

    /**
      * The key of a parent field to filter options
      */
    filterByParent?: string;

    /**
     * Specifies the accepted file types for file input fields (e.g.,
     * 'image/*', '.pdf').
     */
    accept?: string; // for file inputs

    /**
     * Text to display as an error message for the field.
     */
    errorText?: string;

    /**
     * Placeholder text to display in the input field when it is empty.
     */
    placeholder?: string;

	description?: string;

    /**
     * The user interface to use for selecting options on mobile devices.
     */
    selectInterface?: 'popover' | 'action-sheet' | 'modal';

    /**
      * The placement of the label
      */
    labelPlacement?: string;

    /**
      * The value to use for a true boolean value.
      */
    trueValue?: string;

    /**
     * The value to use for a false boolean value.
     */
    falseValue?: string;

    /**
     * The minimum allowed date for a date input.
     */
    min?: Date;

    /**
     * The source field to use for generating a slug.
     */
    slugSource?: string;

	serverFilter?: boolean; // if true, pass search term to loadOptions

	multiple?: boolean; // for multi-select

    /**
     * A function to load options asynchronously.
     */
    loadOptions?: (parentValue?: any) => Promise<Array<{ label: string; value: any }>>;

    /**
     * A function that determines whether the field should be rendered based on
     * the current form values.
     */
    renderIf?: (form: FormGroup) => boolean;

    /**
     * A callback function that is called when the field's value changes.
     */
    onChange?: (form: FormGroup) => void;

    /**
      * A callback function that is called when the field is focused.
      */
    onFocus?: (form: FormGroup) => void;

    /**
     * A callback function that is called when the field loses focus.
     */
    onBlur?: (form: FormGroup) => void;

    /**
     * A callback function that is called when the field is initialized.
     */
    onInit?: (form: FormGroup) => void;

    /**
     * A function to transform the field's value before it is submitted.
     */
    transformValue?: (value: any) => any;

     /**
     * A function to suggest options, for autocomplete fields.
     */
    autocompleteFn?: (search: string) => Promise<any[]>;
    /**
     * A function to customize display an option.
     */
    displayWith?: (option: any) => string;
}
