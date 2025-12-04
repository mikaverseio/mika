import { mikaActionConfig } from "../config/mika-action.config";
import { EMikaAction } from "../enum/mika-action.enum";
import { MikaExecutableAction } from "../types/mika-app.type";

export function normalizeAction(input: boolean | Partial<MikaExecutableAction>): MikaExecutableAction {
	if (typeof input === 'boolean') {
		return {
			visible: input,
			allowed: () => input
		};
	}

	return {
		...input,
		visible: input.visible ?? true,
		allowed: input.allowed ?? (() => true)
	};
}

export function mergeActionDefaults(key: EMikaAction, override?: Partial<MikaExecutableAction>): MikaExecutableAction {
	const base = mikaActionConfig[key] ?? {};
	return normalizeAction({ ...base, ...override });
}
