import { InjectionToken } from '@angular/core';

export interface MikaConfirmButton {
  text: string;   // translation key or raw text
  role: string;   // 'cancel' | 'confirm' | etc.
}

export interface MikaConfirmOptions {
  header: string;       // translation key or raw text
  message: string;      // translation key or raw text
  buttons: MikaConfirmButton[];
}

export interface MikaUiPort {
  confirm(options: MikaConfirmOptions): Promise<{ role?: string }>;

  showLoading(message?: string): void;
  hideLoading(): void;

  toastSuccess(message: string): void;
  toastError(message: string): void;
}

export const MIKA_UI_PORT = new InjectionToken<MikaUiPort>('MIKA_UI_PORT');
