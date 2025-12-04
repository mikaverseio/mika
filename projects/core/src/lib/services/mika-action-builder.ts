// 🧱 MikaActionBuilderV2 — Fluent API for registering, customizing, and executing Mika actions

import { normalizeAction } from '../normalizers/action.normalization';
import { MikaActionKey, MikaExecutableAction } from '../types/mika-app.type';
import { MikaActionService } from './mika-action-1.service';

export class MikaActionBuilder {
	private _key?: MikaActionKey;
	private _overrides: Partial<MikaExecutableAction> = {};
	private _context: any = {};

	constructor(private actions: MikaActionService, key?: MikaActionKey) {
		if (key) this._key = key;
	}

	key(key: MikaActionKey): this {
		this._key = key;
		return this;
	}

	confirm(message?: string): this {
		this._overrides.confirm = true;
		if (message) this._overrides.confirmMessage = message;
		return this;
	}

	set(overrides: Partial<MikaExecutableAction>): this {
		this._overrides = { ...this._overrides, ...overrides };
		return this;
	}

	context(ctx: any): this {
		this._context = ctx;
		return this;
	}


	async perform(callback?: () => any): Promise<boolean> {
		let base: Partial<MikaExecutableAction> = {};

		if (this._key) {
			base = this.actions.get(this._key) ?? {};
		}

		const resolved = normalizeAction({ ...base, ...this._overrides });
		const fn = callback
			?? resolved.perform
			?? (typeof resolved.handler === 'function' ? () => resolved.handler?.(this._context?.item) : undefined);

		// 🔐 Handle permission check if exists
		if (typeof resolved.canPerform === 'function') {
			const allowed = await Promise.resolve(resolved.canPerform(this._context));
			if (!allowed) {
				this.actions.toast.error(resolved.permissionDeniedMessage ?? 'permission-denied');
				return false;
			}
		}

		// 🔐 Centralized permission check using service method
		if (!this.actions.canPerform?.(resolved, this._context)) {
			this.actions.toast.error(resolved.permissionDeniedMessage ?? 'permission-denied');
			return false;
		}

		// ✅ Handle confirmation dialog
		if (resolved.confirm) {
			const confirmed = await this.actions.confirmDialog(resolved, this._context);
			if (!confirmed) return false;
		}

		try {
			if (resolved.loadingMessage) this.actions.loader.show(resolved.loadingMessage);
			await fn?.();
			if (resolved.toastSuccess) this.actions.toast.success(resolved.toastSuccess);
			return true;
		} catch (err) {
			console.error('[MikaActionBuilderV2] Action error:', err);
			if (resolved.toastError) this.actions.toast.error(resolved.toastError);
			return false;
		} finally {
			if (resolved.loadingMessage) this.actions.loader.hide();
		}
	}
}
