import { EMikaAction } from "../../enum/mika-action.enum";

/**
 * @interface MikaBaseAction
 * @description Defines the basic structure for action configurations within the Mika system.
 * This interface provides a set of common properties that can be used to customize
 * the behavior and appearance of actions throughout the application.  It is intended
 * to be extended or used as a base for more specific action configurations.
 */
export interface MikaBaseAction {
	/**
	 * @property permission
	 * @type string
	 * @description An optional permission string that can be checked by the MikaActionService
	 * to determine if the user has the necessary permissions to perform the action.
	 * If a permission is provided, the service should verify that the current user
	 * has this permission before allowing the action to proceed.  The specific
	 * implementation of permission checking is handled by the MikaActionService.
	 */
	permission?: string;

	/**
	 * @property confirm
	 * @type boolean
	 * @description  A boolean value indicating whether a confirmation dialog should be displayed
	 * before the action is executed.  If set to `true`, the MikaActionService will show a
	 * confirmation dialog (using IonAlert) to the user, prompting them to confirm
	 * their intention.  The action will only proceed if the user confirms.
	 */
	confirm?: boolean;

	/**
	 * @property toast
	 * @type string
	 * @description An optional string representing the message to be displayed in a toast notification
	 * upon successful completion of the action.  If provided, the MikaActionService will use
	 * the AppService to show a success toast with this message after the action's
	 * callback function is executed.
	 */
	toastSuccess?: string;


	/**
	 * @property toast
	 * @type string
	 * @description An optional string representing the message to be displayed in a toast notification
	 * upon fail completion of the action.  If provided, the MikaActionService will use
	 * the AppService to show a success toast with this message after the action's
	 * callback function is executed. If not provided a default message will appear
	 */
	toastError?: string;

	/**
	 * @property visible
	 * @type boolean | ((ctx: any) => boolean)
	 * @description  Determines the UI visibility of the action.  It can be either a boolean
	 * or a function that returns a boolean.  If it's a boolean, it directly sets the
	 * visibility.  If it's a function, it's evaluated with a context object (`ctx`)
	 * to dynamically determine visibility.  This allows for context-sensitive display
	 * of actions in the user interface.
	 */
	visible?: boolean | ((ctx: any) => boolean);

	/**
	 * @property allowed
	 * @type (ctx: any) => boolean
	 * @description  A function that determines if the action is allowed to be executed
	 * based on the provided context (`ctx`).  This is a logic-level check, separate from UI
	 * visibility.  The function should return `true` if the action is allowed, and `false`
	 * otherwise.  This allows for complex business logic to control action execution.
	 */
	allowed?: (ctx: any) => boolean;

	/**
	 * @property showLoading
	 * @type boolean
	 * @description  A boolean value indicating whether a loading indicator should be displayed
	 * while the action is being performed.  If `true`, the MikaActionService will use the
	 * MikaLoading service to show a loading spinner with an optional message.
	 */
	showLoading?: boolean;

	/**
	  * @property loadingMessage
	  * @type string
	  * @description Optional message to show while the loading indicator is active.
	  * If showLoading is true and this message is provided, the MikaLoading service
	  * will display this message.
	  */
	loadingMessage?: string;

	/**
	 * @property confirmMessage
	 * @type string
	 * @description  The message to be displayed in the confirmation dialog (IonAlert).
	 * This property is only relevant if `confirm` is set to `true`.  It provides
	 * the user with specific information about the action they are about to perform.
	 */
	confirmMessage?: string;

	/**
	* @property confirmHeader
	* @type string
	* @description The header text for the confirmation dialog.  This provides a title
	* for the confirmation prompt, helping the user understand the context of the action.
	*/
	confirmHeader?: string;

	/**
	  * @property confirmButtons
	  * @type Array<{ text: string; role: string }>
	  * @description  An array of button configurations for the confirmation dialog.  Each
	  * button is an object with a `text` property (the button label) and a `role` property
	  * (which can be 'cancel', 'confirm', or other custom roles).  The MikaActionService
	  * uses these buttons when presenting the confirmation dialog to the user.
	  */
	confirmButtons?: Array<{ text: string; role: string }>;

	key?: EMikaAction
	/**
	 * The title of the custom action (e.g., 'Export to CSV', 'Send Email').
	 * This is displayed as the button label or link text.
	 */
	title?: string;

	/**
	 * The icon to display for the custom action (e.g., 'file-csv', 'envelope').
	 * This should correspond to an icon from your chosen icon library
	 * (e.g., Font Awesome, Material Icons).
	 */
	icon?: string;

	/**
	 * A handler function that is executed when the custom action is performed.
	 * This function receives the entity item as a parameter, allowing you to
	 * access the data for the selected entity.  The function can perform
	 * any necessary logic, such as making an API call, updating the UI,
	 * or navigating to a different page.
	 */
	handler?: (item: any) => any;

	canPerform?: (context: any) => boolean | Promise<boolean>;

	perform?: () => any;

	permissionDeniedMessage?: string;
}
