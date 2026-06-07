import { Injectable } from '@angular/core';
import { MikaEntityConfig, MikaGlobalEntityConfig, MikaHookRegistry, MikaHookContext } from '../../schema';
import { Mika } from '../../helpers/mika-app.helper';

@Injectable({ providedIn: 'root' })
export class MikaHookService {

	async safeExecuteHook<T = any>(hookName: keyof MikaEntityConfig | keyof MikaGlobalEntityConfig, config: MikaEntityConfig, ...args: any[]): Promise<T | null> {
		const hookKey = hookName as string;

		let hook = (config as any)?.[hookKey] as Function | undefined;

		if (!hook) {
			hook = (Mika.get().globalEntityConfig as any)?.[hookKey] as Function | undefined;
		}

		if (hook && typeof hook === 'function') {
			try {
				const result = hook(...args);
				return result instanceof Promise ? await result : result;
			} catch (error) {
				console.error(`[MikaForm] Error executing hook "${String(hookName)}":`, error);
			}
		}
		return null;
	}

	async safeExecuteHookRegistery<K extends keyof MikaHookRegistry>(
		hookName: K,
		context: MikaHookContext,
		args: Parameters<NonNullable<MikaHookRegistry[K]>> // 👈 نوع صارم مؤكد
	): Promise<Awaited<ReturnType<NonNullable<MikaHookRegistry[K]>>> | null> {

		const localHook = context.config?.[hookName] as MikaHookRegistry[K];
		const globalHook = Mika.get().globalEntityConfig?.[hookName] as MikaHookRegistry[K];

		const hook = localHook || globalHook;

		if (typeof hook === 'function') {
			try {
				const result = hook.apply(null, args); // ✅ بدون ...args
				return result instanceof Promise ? await result : result;
			} catch (error) {
				console.error(`[MikaForm] Error executing hook "${String(hookName)}":`, error);
			}
		}

		return null;
	}

}
