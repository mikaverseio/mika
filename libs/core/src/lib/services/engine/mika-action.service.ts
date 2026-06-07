import { Injectable, inject } from '@angular/core';
import { MIKA_UI_PORT, MikaUiPort } from '../../tokens/mika-ui.tokens';
import { EMikaAction, MikaActionRegistry, MikaActionKey, MikaExecutableAction } from '../../schema';

@Injectable({ providedIn: 'root' })
export class MikaActionService {
  private actions: any = MikaActionRegistry.getAll();

  private _action!: MikaActionKey;
  private _loadingMessage = '';
  private _overrides: any = null;

  // Optional UI port: UI libs provide it. If missing, we degrade safely.
  private ui: MikaUiPort | null = inject(MIKA_UI_PORT, { optional: true });

  // Expose UI port to helper classes (builders) without leaking implementation.
  get uiPort(): MikaUiPort | null {
    return this.ui;
  }

  // Expose registered action definition
  get(key: MikaActionKey): MikaExecutableAction | undefined {
    return this.actions[key];
  }

  // Keep this method for backward compatibility (no-op now)
  // so existing code calling setAlert() won't break.
  setAlert(_alert: any) {
    // intentionally ignored — confirmations go through MIKA_UI_PORT
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
    if (action.visible === false) return false;
    if (typeof action.visible === 'function' && !action.visible(context)) return false;
    if (typeof action.allowed === 'function' && !action.allowed(context)) return false;
    return true;
  }

  async perform(callback: any = null, errorCallback: any = null) {
    let action: any = this.actions[this._action];
    if (this._overrides) action = { ...action, ...this._overrides };

    if (action.shouldConfirm) {
      const ok = await this.confirmAction(action);
      if (!ok) return false;
    }

    return await this.executeCallback(action, callback, errorCallback);
  }

  private async confirmAction(action: any): Promise<boolean> {
    if (!this.ui) {
      console.error('MikaActionService: MIKA_UI_PORT not provided; cannot show confirmation UI.');
      return false;
    }

    const res = await this.ui.confirm({
      header: action.header,
      message: action.message,
      buttons: (action.buttons ?? []).map((b: any) => ({ text: b.text, role: b.role })),
    });

    return res?.role === 'confirm';
  }

  private async executeCallback(action: any, callback: any, errorCallback: any = null): Promise<boolean> {
    try {
      if (action.showLoading) this.ui?.showLoading(this._loadingMessage);

      const result = callback?.();
      if (result instanceof Promise) await result;

      if (action.toast) this.ui?.toastSuccess(action.toast);

      return true;
    } catch (error) {
      this.ui?.toastError('Something bad happened. Please try again.');
      if (errorCallback) errorCallback(error);
      return false;
    } finally {
      this.ui?.hideLoading();
    }
  }
}
