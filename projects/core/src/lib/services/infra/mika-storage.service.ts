import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class MikaStorageService {

	async set(key: string, value: any) {
		await Preferences.set({
			key: key,
			value: JSON.stringify(value),
		});
	}

	async get(key: string) {
		const { value } = await Preferences.get({ key: key });
		return value ? JSON.parse(value) : null;
	}

	async remove(key: string) {
		await Preferences.remove({ key: key });
	}

	async clear() {
		await Preferences.clear();
	}

	async getAll() {
		return await Preferences.keys();
	}

}
