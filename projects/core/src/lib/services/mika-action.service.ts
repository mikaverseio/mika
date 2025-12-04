import { Injectable } from '@angular/core';
import { IonAlert } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { MikaLoading } from './mika-loading.service';
import { ToastService } from './general/app.service';
import { mikaActionConfig } from '../config/mika-action.config';
import { EMikaAction } from '../enum/mika-action.enum';
import { MikaActionRegistry } from '../config/mika-action.registry';
import { MikaActionKey, MikaExecutableAction } from '../types/mika-app.type';

@Injectable({
	providedIn: 'root'
})
export class MikaActionService {

	private actionAlert!: IonAlert;
	private actions: any = MikaActionRegistry.getAll();

	private _action!: MikaActionKey;
	private _loadingMessage: string = '';
	private _overrides: any = null;

	constructor(
		private toast: ToastService,
		private uiLoader: MikaLoading,
		private translate: TranslateService,
	) {
	}

	setAlert(alert: IonAlert) {
		this.actionAlert = alert;
	}

	action(key: MikaActionKey, overrides: Partial<MikaExecutableAction> = {}): this {
		this._action = key;
		this._overrides = overrides;
		return this;
	}

	actiona(action: EMikaAction, loadingMessage: string = '', overrides: any = null) {
		this._loadingMessage = loadingMessage;
		this._action = action;
		this._overrides = overrides;

		return this;
	}

	canPerform(action: Partial<MikaExecutableAction>, context?: any): boolean {
		// if (action.permission && !this.auth.hasPermission(action.permission)) return false;
		if (action.visible === false) return false;
		if (typeof action.visible === 'function' && !action.visible(context)) return false;
		if (typeof action.allowed === 'function' && !action.allowed(context)) return false;

		return true;
	}

	async perform(callback: any = null, errorCallback: any = null) {
		let action: any = this.actions[this._action];
		if (this._overrides) {
			action = { ...action, ...this._overrides };
		}

		if (action.shouldConfirm) {
			return await this.confirmAction(action, callback, errorCallback);
		}
		return await this.executeCallback(action, callback, errorCallback);
	}

	private async confirmAction(action: any, callback: any = null, errorCallback: any = null) {
		if (!this.actionAlert) {
			console.error('MikaActionService: IonAlert not set.  Confirmation may not display.');
			return false;
		}

		this.actionAlert.header = this.translate.instant(action.header);
		this.actionAlert.message = this.translate.instant(action.message);
		this.actionAlert.buttons = action.buttons.map((button: any) => {
			return {
				text: this.translate.instant(button.text),
				role: button.role
			}
		});

		await this.actionAlert?.present();
		const role = (await this.actionAlert?.onDidDismiss())?.role;

		if (role !== 'confirm') return false;

		if (callback) {
			return await this.executeCallback(action, callback);
		}

		return role === 'confirm';
	}

	private async executeCallback(action: any, callback: any, errorCallback: any = null) {
		try {

			// should load
			if (action.showLoading) this.uiLoader.present(this._loadingMessage);

			// execute
			const result = callback();

			if (result instanceof Promise) {
				await result;
			}

			if (action.toast) {
				this.toast.showToast(action.toast, 'success');
			}

			return true;
		} catch (error) {
			this.toast.showToast('Something bad happened. Please try again.', 'danger');
			return false;
		} finally {
			this.uiLoader.dismiss();
		}
	}
}
