import { inject, Injectable } from '@angular/core';
import { MIKA_STORAGE_PORT, MikaStoragePort } from '../../tokens';

// Lightweight, platform-agnostic key/value storage wrapper.
// Uses Web Storage when available; no Capacitor/ionic dependency.
@Injectable({ providedIn: 'root' })
export class MikaStorageService {
  private adapter = inject(MIKA_STORAGE_PORT, { optional: true });
  private get store(): Storage | null {
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    if (this.adapter?.set) {
      await this.adapter.set(key, value);
      return;
    }
    if (!this.store) return;
    this.store.setItem(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any | null> {
    if (this.adapter?.get) {
      const value = await this.adapter.get(key);
      return value;
    }
    if (!this.store) return null;
    const value = this.store.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async remove(key: string): Promise<void> {
    if (this.adapter?.remove) {
      await this.adapter.remove(key);
      return;
    }
    this.store?.removeItem(key);
  }

  async clear(): Promise<void> {
    if (this.adapter?.clear) {
      await this.adapter.clear();
      return;
    }
    this.store?.clear();
  }

  async getAll(): Promise<string[]> {
    if (this.adapter?.keys) {
      const keys = await this.adapter.keys();
      return keys ?? [];
    }
    if (!this.store) return [];
    return Object.keys(this.store);
  }
}
