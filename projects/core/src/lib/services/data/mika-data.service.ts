import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MikaDataService {
	private store: Record<string, WritableSignal<any[]>> = {};

	storeSignal(key: string, data: any[]) {
		if (!this.store[key]) this.store[key] = signal([]);
		this.store[key].set(data);
	}

	getSignal(key: string): WritableSignal<any[]> | undefined {
		return this.store[key];
	}

	getValue(key: string): any[] {
		return this.store[key]?.() ?? [];
	}
}
