// // src/mika-form/services/mika-action.service.ts
// import { Injectable } from '@angular/core';
// import { IonAlert } from '@ionic/angular';
// import { TranslateService } from '@ngx-translate/core';
// import { AppService } from './general/app.service';
// import { MikaLoading } from './mika-loading.service';
// import { MikaAuthService } from './auth/mika-auth.service';
// import { MikaExecutableAction } from '../interfaces/action/mika-custom-action.interface';
// import { mergeActionDefaults, normalizeAction } from '../utils/action.util';
// import { MikaActionKey } from '../enum/mika-action.enum';
// import { MikaActionRegistry } from '../config/mika-action.registry';

// @Injectable({ providedIn: 'root' })
// export class MikaActionService {
// 	private actionAlert!: IonAlert;

// 	private _action!: MikaActionKey;
// 	private _loadingMessage: string = '';
// 	private _overrides: any = null;

// 	constructor(
// 		private app: AppService,
// 		private uiLoader: MikaLoading,
// 		private translate: TranslateService,
// 		private auth: MikaAuthService
// 	) { }

// 	setAlert(alert: IonAlert) {
// 		this.actionAlert = alert;
// 	}

// 	action(key: MikaActionKey, overrides: Partial<MikaExecutableAction> = {}): this {
// 		this._action = key;
// 		this._overrides = overrides;
// 		return this;
// 	}

// 	canPerform(action: Partial<MikaExecutableAction>, context?: any): boolean {
// 		if (action.visible === false) return false;
// 		if (typeof action.visible === 'function' && !action.visible(context)) return false;

// 		if (typeof action.allowed === 'function' && !action.allowed(context)) return false;

// 		// if (action.permission && !this.auth.hasPermission(action.permission)) return false;

// 		return true;
// 	}

// 	async perform(action: MikaActionKey | Partial<MikaExecutableAction>, context: any = {}, fallbackCallback?: () => any): Promise<boolean> {

// 		if (typeof action === 'string') {
// 			action = MikaActionRegistry.get(action)!;
// 		}

// 		const resolved = normalizeAction(action);

// 		if (!this.canPerform(resolved, context)) return false;

// 		if (resolved.confirm) {
// 			const confirmed = await this.confirmAction(resolved);
// 			if (!confirmed) return false;
// 		}

// 		const callback = resolved.handler ? () => resolved.handler!(context) : fallbackCallback;
// 		return this.executeCallback(resolved, callback);
// 	}

// 	private async confirmAction(action: MikaExecutableAction): Promise<boolean> {
// 		this.actionAlert.header = this.translate.instant(action.confirmHeader || 'Confirm');
// 		this.actionAlert.message = this.translate.instant(action.confirmMessage || 'Are you sure?');
// 		this.actionAlert.buttons = action.confirmButtons ?? [
// 			{ text: this.translate.instant('Cancel'), role: 'cancel' },
// 			{ text: this.translate.instant('Confirm'), role: 'confirm' }
// 		];

// 		await this.actionAlert.present();
// 		const result = await this.actionAlert.onDidDismiss();
// 		return result?.role === 'confirm';
// 	}

// 	private async executeCallback(
// 		action: MikaExecutableAction,
// 		callback?: () => any
// 	): Promise<boolean> {
// 		try {
// 			if (action.showLoading) {
// 				this.uiLoader.present(action.loadingMessage || '');
// 			}

// 			const result = callback?.();
// 			if (result instanceof Promise) await result;

// 			if (action.toast) {
// 				this.app.showToast(action.toast, 'success');
// 			}

// 			return true;
// 		} catch (error) {
// 			this.app.showToast('Something went wrong', 'danger');
// 			console.error(error);
// 			return false;
// 		} finally {
// 			this.uiLoader.dismiss();
// 		}
// 	}
// }


import { Injectable } from '@angular/core';
import { MikaLoading } from '..//data/mika-loading.service';
import { MikaUiService } from '../view/mika-ui.service';
import { MikaActionBuilder } from './mika-action-builder';
import { MikaActionRegistry } from '../../config/mika-action.registry';
import { MikaAuthService } from '../auth/mika-auth.service';
import { MikaActionKey, MikaExecutableAction } from '../../types/mika-app.type';

@Injectable({ providedIn: 'root' })
export class MikaActionService {
	constructor(
		private loaderService: MikaLoading,
		private toastService: MikaUiService,
		private auth: MikaAuthService
	) { }

	/**
	 * Returns the builder wrapper for fluent usage
	 */
	action(key: MikaActionKey): MikaActionBuilder {
		return new MikaActionBuilder(this, key);
	}

	/**
	 * Returns raw registered action
	 */
	get(key: MikaActionKey): MikaExecutableAction | undefined {
		return MikaActionRegistry.get(key);
	}

	/**
	 * Confirms the action via default dialog
	 */
	async confirmDialog(action: Partial<MikaExecutableAction>, context: any): Promise<boolean> {
		// Replace this with custom modal later
		return confirm(action.confirmMessage ?? 'Are you sure?');
	}

	/**
	 * Accessor for loader (used in builder)
	 */
	get loader() {
		return {
			show: (msg?: string) => this.loaderService.present(msg),
			hide: () => this.loaderService.dismiss(),
		};
	}

	/**
	 * Accessor for toast (used in builder)
	 */
	get toast() {
		return {
			success: (msg: string) => this.toastService.showToast(msg, 'success'),
			error: (msg: string) => this.toastService.showToast(msg, 'error'),
		};
	}

	/**
	 * Register an action manually
	 */
	register(key: MikaActionKey, action: MikaExecutableAction): void {
		MikaActionRegistry.register(key, action);
	}

	/**
	 * Optional: clear all registered actions
	 */
	clear(): void {
		MikaActionRegistry.clear();
	}

	canPerform(action: Partial<MikaExecutableAction>, context: any): boolean {
		const permissionKey = action.permission ?? action.key;

		if (this.auth && typeof this.auth.hasPermission === 'function') {
			const allowed = this.auth.hasPermission(permissionKey);
			if (!allowed) return false;
		}

		if (typeof action.canPerform === 'function' && !action.canPerform(context)) {
			return false;
		}

		if (action.visible === false) return false;
		if (typeof action.visible === 'function' && !action.visible(context)) {
			return false;
		}

		if (typeof action.allowed === 'function' && !action.allowed(context)) {
			return false;
		}

		return true;
	}

}

