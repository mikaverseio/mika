import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MikaContextService } from '../engine/mika-context.service';
import { MikaApiService } from '../http/mika-api.service';
import { firstValueFrom } from 'rxjs';
import { MikaConfigService } from '../engine/mika-config.service';

@Injectable({ providedIn: 'root' })
export class MikaDataService {

	private context = inject(MikaContextService)
	private api = inject(MikaApiService)
	private config = inject(MikaConfigService);

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

	countEntityItems() {

	}

	async getRecent(slug: string) {
		const config = await this.config.getConfig(slug);
		const request = this.api.config(config!).list({limit: 1});
		const response = await firstValueFrom(request);
		console.log(response);
	}
}
