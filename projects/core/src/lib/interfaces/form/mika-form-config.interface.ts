import { MikaDesignSystem } from "../../types/mika-app.type";

export interface MikaFormConfig {
	/**
         * Message to show when user tries to leave the form with unsaved changes
         */
	confirmLeaveMessage?: string;
	/**
	 * Enable/disable confirmation on form leave with unsaved changes.
	 */
	confirmLeave?: boolean; // set false to silent discard
	/**
	 * Automatically save the form data when the user navigates away
	 */
	autoSaveOnLeave?: boolean;
	/**
	 * Enable autosave
	 */
	autoSave?: boolean;
	/**
	 * Debounce time for autosave
	 */
	autoSaveDebounce?: number;

	/**
	 * Indicates whether the form for creating/editing this entity should be
	 * displayed in a step-by-step wizard format.
	 */
	steppedForm?: boolean;

	designSystem?: MikaDesignSystem;
}
