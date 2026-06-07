import { InjectionToken } from '@angular/core';

export interface MikaStoragePort {
  set(key: string, value: any): Promise<void> | void;
  get(key: string): Promise<any | null> | any | null;
  remove(key: string): Promise<void> | void;
  clear(): Promise<void> | void;
  keys?(): Promise<string[]> | string[];
}

export const MIKA_STORAGE_PORT = new InjectionToken<MikaStoragePort>('MIKA_STORAGE_PORT');
