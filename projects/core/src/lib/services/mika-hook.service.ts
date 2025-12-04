import { Injectable } from '@angular/core';
import { MikaEntityConfig } from '../interfaces/entity/mika-entity-config.interface';
import { GlobalEntityConfig } from '../interfaces/entity/globla-entity-config.interface';
import { HookRegistry } from '../interfaces/hooks/hook-registry.interface';
import { HookContext } from '../interfaces/hooks/hook-context.interface';
import { Mika } from '../helpers/mika-app.helper';

@Injectable({ providedIn: 'root' })
export class MikaHookService {

	async safeExecuteHook<T = any>(hookName: keyof MikaEntityConfig | keyof GlobalEntityConfig, config: MikaEntityConfig, ...args: any[]): Promise<T | null> {
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

	async safeExecuteHookRegistery<K extends keyof HookRegistry>(
		hookName: K,
		context: HookContext,
		args: Parameters<NonNullable<HookRegistry[K]>> // 👈 نوع صارم مؤكد
	): Promise<Awaited<ReturnType<NonNullable<HookRegistry[K]>>> | null> {

		const localHook = context.config?.[hookName] as HookRegistry[K];
		const globalHook = Mika.get().globalEntityConfig?.[hookName] as HookRegistry[K];

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
