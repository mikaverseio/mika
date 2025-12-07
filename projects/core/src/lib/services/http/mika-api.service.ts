import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { MikaUrlHelper } from '../../helpers/mika-endpoint.helper';

/**
 * Core API Facade Service for the Mika Engine.
 * * This service acts as the central router for all external HTTP communication.
 * It is decoupled from environment URLs, authentication tokens, and headers,
 * relying entirely on Angular's HttpInterceptors to manage the runtime context
 * (active Base URL, Tenant ID, Authorization Token).
 * * The primary purpose is to translate Mika's configuration artifacts (EntityConfig)
 * into executable, type-safe CRUD methods.
 */

@Injectable({
	providedIn: 'root'
})
export class MikaApiService {

	headers: any = new HttpHeaders();
	options: any = { headers: this.headers }

	private http = inject(HttpClient);

	constructor() { }

	/**
     * Entry point to configure and retrieve the specific entity's API methods.
     * Returns a facade object with typed methods (e.g., config(...).get(...)).
     */

	config(config: MikaEntityConfig, endpoint?: string) {

		const endpoints = config.endpoints!;

		return {

			// LIST/GET ALL (GET)
			list: (params = {}) => this.get(endpoints.list!, { params }),
			get: (params = {}) => this.get(endpoints?.list!, params),

			// GET ONE (GET /:id)
            getOne: (id: number | string | Record<string, any>) => {
                const params = typeof id === 'object' ? id : { id };
                const url = MikaUrlHelper.replaceParams(endpoints.get!, params);
                return this.get(url);
            },

			// CREATE (POST)
            post: (data: any) => this.post(endpoints.create!, data),

			/**
             * UPDATE (PATCH /:id)
             * Patches an existing record. Automatically resolves the resource ID
             * from the URL template defined in MikaEntityConfig.
             * * @param id The resource ID or a map containing the ID needed for the URL template.
             * @param data The partial data payload to update.
             */
			patch: (id: number | string | Record<string, any>, data: any) => {
				const params = typeof id === 'object'
					? id
					: { [MikaUrlHelper.extractParamKeys(endpoints.update!)[0] ?? 'id']: id };

				const url = MikaUrlHelper.replaceParams(endpoints.update!, params);
				// const url = endpoints.update!.replace(':id', String(id));
				return this.patch(url, data);
			},

			 // DELETE (DELETE /:id)
			delete: (id: number | string | Record<string, any>) => {
				const params = typeof id === 'object' ? id : { id };
				const url = MikaUrlHelper.replaceParams(endpoints.delete!, params);
				return this.delete(url);
			},

			// CUSTOM ENDPOINT RESOLUTION
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

				switch (method) {
					case 'GET': return this.get(url, data);
					case 'POST': return this.post(url, data);
					case 'PATCH': return this.patch(url, data);
					case 'PUT': return this.put(url, data);
					case 'DELETE': return this.delete(url);
					default: throw new Error(`Unsupported method "${method}"`);
				}
			},

			// COUNT (Uses list endpoint, relies on HttpInterceptor to optimize the request)
			count: () => this.count(endpoints?.count! || endpoints?.list!)

		};
	}

	/**
     * Core GET request. Endpoint must be a relative URL (e.g., 'posts' or 'users/1').
     * The HttpInterceptor prepends the base URL.
     */
	get(endpoint: string, options: any = {}): Observable<any> {
        return this.http.get(endpoint, options);
    }

	post(endpoint: string, data: any = null): Observable<any> {
        return this.http.post(endpoint, data, {});
    }

	put(endpoint: string, data: any = null): Observable<any> {
        return this.http.put(endpoint, data, {});
    }

	patch(endpoint: string, data: any = null): Observable<any> {
        return this.http.patch(endpoint, data, {});
    }

	delete(endpoint: string): Observable<any> {
        return this.http.delete(endpoint, {});
    }

	async count(url: string): Promise<number> {
		try {
			const head = await firstValueFrom(
				this.http.head(url, { observe: 'response' })
			) as HttpResponse<any>;

			const total = head?.headers.get('X-Total-Count');
			if (total) return Number(total);
		} catch { }

		// 2) Fallback: GET with ?limit=1 or ?pageSize=1
		try {
			const res: any = await this.http.get(url, {
				params: { limit: 1, pageSize: 1 }
			}).toPromise();

			// Strapi v4 pagination format
			if (res?.meta?.pagination?.total != null) {
				return res.meta.pagination.total;
			}

			// JSON-server / Laravel / generic X-Total-Count
			const header = res.headers?.get?.('X-Total-Count');
			if (header) return Number(header);

			// Worst fallback
			if (Array.isArray(res)) return res.length;

			return 0;
		} catch {
			return 0;
		}
	}
}
