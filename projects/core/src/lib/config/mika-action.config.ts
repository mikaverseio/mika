import { EMikaAction } from "../enum/mika-action.enum";
import { MikaActionKey, MikaExecutableAction } from "../types/mika-app.type";


export const mikaActionConfig: Record<MikaActionKey, Partial<MikaExecutableAction>> = {

	[EMikaAction.CREATE]: {
		toastSuccess: 'created-successfully',
		showLoading: true,
		confirm: false,
	},

	[EMikaAction.SAVE]: {
		toastSuccess: 'saved-successfully',
		showLoading: true,
		confirm: false,
	},

	[EMikaAction.LOAD]: {
		showLoading: true,
		confirm: false,
	},

	[EMikaAction.APPROVE]: {
		toastSuccess: 'approved-successfully',
		showLoading: true,
		confirm: false,
	},

	[EMikaAction.REJECT]: {
		toastSuccess: 'rejected-successfully',
		showLoading: true,
		confirm: false,
	},

	[EMikaAction.CANCEL]: {
		confirmHeader: 'Are you sure?',
		confirmMessage: 'Do you really want to cancel this action?',
		confirmButtons: [
			{ text: 'No', role: 'cancel' },
			{ text: 'Yes', role: 'confirm' }
		],
		toastSuccess: 'cancelled-successfully',
		showLoading: true,
		confirm: true,
	},

	[EMikaAction.DELETE]: {
		confirmHeader: 'Warning',
		confirmMessage: 'Do you want to delete?',
		confirmButtons: [
			{ text: 'Cancel', role: 'cancel' },
			{ text: 'Delete', role: 'confirm' }
		],
		toastSuccess: 'deleted-successfully',
		showLoading: true,
		confirm: true,
	},

	[EMikaAction.LOGOUT]: {
		confirmHeader: 'logout',
		confirmMessage: 'Do you really want to log out?',
		confirmButtons: [
			{ text: 'Cancel', role: 'cancel' },
			{ text: 'logout', role: 'confirm' }
		],
		toastSuccess: 'logout-successfully',
		showLoading: true,
		confirm: true,
	},
	[EMikaAction.HIDE]: {
		confirmHeader: 'hide-profile',
		confirmMessage: 'Do you really want to hide this profile?',
		confirmButtons: [
			{ text: 'Cancel', role: 'cancel' },
			{ text: 'Yes', role: 'confirm' }
		],
		toastSuccess: 'hidden-successfully',
		showLoading: true,
		confirm: true,
	},
	[EMikaAction.SHOW]: {
		confirmHeader: 'show-profile',
		confirmMessage: 'Do you really want to show this profile?',
		confirmButtons: [
			{ text: 'Cancel', role: 'cancel' },
			{ text: 'Yes', role: 'confirm' }
		],
		toastSuccess: 'shown-successfully',
		showLoading: true,
		confirm: true,
	},
};
