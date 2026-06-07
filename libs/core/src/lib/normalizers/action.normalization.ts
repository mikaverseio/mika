import { mikaActionConfig, EMikaAction, MikaExecutableAction } from '../schema';

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
