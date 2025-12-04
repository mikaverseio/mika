export interface BaseFieldConfig {
    /**
     * The unique key for the form field.  This is used to identify the field
     * within the form group and to bind the field to a specific data property.
     * This is a *required* property.
     */
    key: string;

    /**
     * The label to display for the form field in the user interface.  This is
     * typically shown next to the input element.
     */
    label: string;

    /**
     * Indicates whether the field supports translation.  If true, the field's value
     * may be stored in multiple languages.
     */
    localizable?: boolean;
}