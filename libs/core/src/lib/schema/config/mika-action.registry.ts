

import { MikaActionKey, MikaExecutableAction } from "../types/mika-app.type";
import { mikaActionConfig } from "./mika-action.config";

const actionMap: Record<MikaActionKey, Partial<MikaExecutableAction>> = { ...mikaActionConfig };

export const MikaActionRegistry = {
	register(key: MikaActionKey, action: Partial<MikaExecutableAction>) {

		if (actionMap[key]) {
			console.warn('You cannot use same action key');
			return;
		}

		actionMap[key] = action;
	},

	get(key: MikaActionKey): Partial<MikaExecutableAction> | undefined {
		return actionMap[key];
	},

	getAll(): Record<MikaActionKey, Partial<MikaExecutableAction>> {
		return { ...actionMap };
	},

	clear() {
		Object.keys(actionMap).forEach(k => delete actionMap[k]);
	}
};
