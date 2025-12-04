import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaUrlHelper } from '../../helpers/mika-endpoint.helper';

@Injectable({
	providedIn: 'root'
})
export class MikaApiService {

	headers: any = new HttpHeaders();
	options: any = { headers: this.headers }

	private http = inject(HttpClient);

	constructor() { }

	config(config: MikaEntityConfig, endpoint?: string) {
		const endpoints = config.endpoints!;
		return {
			get: (params = {}) => this.get(config.endpoints?.list!, params),
			list: (params = {}) => this.get(endpoints.list!, params),

			getOne: (id: number | string | Record<string, any>) => {
				const params = typeof id === 'object' ? id : { id };
				const url = MikaUrlHelper.replaceParams(endpoints.get!, params);
				return this.get(url);
			},

			post: (data: any) => this.post(config.endpoints?.create!, data),
			patch: (id: number | string | Record<string, any>, data: any) => {
				const params = typeof id === 'object'
					? id
					: { [MikaUrlHelper.extractParamKeys(endpoints.update!)[0] ?? 'id']: id };

				const url = MikaUrlHelper.replaceParams(endpoints.update!, params);
				// const url = endpoints.update!.replace(':id', String(id));
				return this.patch(url, data);
			},
			delete: (id: number | string | Record<string, any>) => {
				const params = typeof id === 'object' ? id : { id };
				const url = MikaUrlHelper.replaceParams(endpoints.delete!, params);
				return this.delete(url);
			},
			custom: (suffix: string, data?: any) => this.post(`/${suffix}`, data),
			customEndpoint: (key: string, data: any = {}) => {
				const entry = endpoints.custom?.[key];
				if (!entry) throw new Error(`Custom endpoint "${key}" is not defined`);

				const template = typeof entry === 'string' ? entry : entry.url;
				const method = typeof entry === 'string' ? 'POST' : (entry.method?.toUpperCase?.() ?? 'POST');

				const isObj = typeof data === 'object' && !Array.isArray(data);
				const paramKeys = MikaUrlHelper.extractParamKeys(template);
				const params = isObj ? data : { [paramKeys[0] ?? 'id']: data };

				const url = MikaUrlHelper.replaceParams(template, params);

				console.log('urll', url);

				switch (method) {
					case 'GET': return this.get(url, data);
					case 'POST': return this.post(url, data);
					case 'PATCH': return this.patch(url, data);
					case 'PUT': return this.put(url, data);
					case 'DELETE': return this.delete(url);
					default: throw new Error(`Unsupported method "${method}"`);
				}
			}

		};
	}

	get(endpoint: string, params: any = null): Observable<any> {
		return this.http.get(endpoint, { ...this.options, params: params }).pipe(map(res => res));
	}

	post(endpoint: string, data: any = null): Observable<any> {
		return this.http.post(endpoint, data, this.options).pipe(
			map(res => res)
		);
	}

	put(endpoint: string, data: any = null): Observable<any> {
		return this.http.put(endpoint, data, this.options).pipe(
			map(res => res)
		);
	}

	patch(endpoint: string, data: any = null): Observable<any> {
		return this.http.patch(endpoint, data, this.options).pipe(map(res => res));
	}

	delete(endpoint: string): Observable<any> {
		return this.http.delete(endpoint, this.options).pipe(
			map(res => res)
		);
	}
}
