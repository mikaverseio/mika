import { inject, Injectable } from '@angular/core';
import { MikaStorageService } from '../infra/mika-storage.service';
import { MikaUiService } from '../view/mika-ui.service';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';

@Injectable({ providedIn: 'root' })
export class MikaLocalStorageAdapterService {

	preferences = inject(MikaStorageService);
	toast = inject(MikaUiService);

	async list(contentType: string, filters: any, params: any) {
		const raw = await this.preferences.get(contentType);
		const allData = raw ?? [];

		let filtered = [...allData];
		for (const [k, v] of Object.entries(filters ?? {})) {
			filtered = filtered.filter((item: any) => String(item[k]).includes(String(v)));
		}
		const start = (params.page - 1) * params.take;
		const paged = filtered.slice(start, start + params.take);

		return {
			data: paged,
			total: filtered.length
		};
	}

	async get(entityConfig: MikaEntityConfig, id: string | number) {
		const idKey = entityConfig.table.idColumn ? entityConfig.table.idColumn : 'id';
		const data = await this.preferences.get(entityConfig.contentType) ?? [];

		const item = data.find((d: any) => {
			const result = d[idKey] == id; // use == to allow string/number matching
			return result;
		});

		return item ?? null;
	}

	async getById(key: string, id: number | string) {

		return
	}

	async addOrUpdate(entityConfig: MikaEntityConfig, data: any, id?: string | number) {
		let localData = await this.preferences.get(entityConfig.contentType);
		localData = localData || [];
		if (id) {
			const index = localData.findIndex((item: any) => item.id === id);
			if (index !== -1) localData[index] = { ...localData[index], ...data };
		} else {
			if (entityConfig.generateId) {
				data.id = Date.now();
			}
			localData.push(data);
		}
		await this.preferences.set(entityConfig.contentType, localData);
	}

	async delete(contentType: string, id: string | number) {

	}

	async set(contentType: string, data: any) {
		return await this.preferences.set(contentType, data);
	}


}
