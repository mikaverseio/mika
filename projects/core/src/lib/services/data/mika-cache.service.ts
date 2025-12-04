import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MikaCacheService {
	private firstPageCache = new Map<string, { data: any[]; total: number }>();
	private pagesCache = new Map<string, Map<string, { data: any[]; total: number }>>();

	private getPageCacheKey(slug: string, page: number, filters: Record<string, any> = {}): string {
		const key = `page=${page}&` + Object.entries(filters).map(([k, v]) => `${k}=${v}`).join('&');
		return key;
	}

	setCachedPage(slug: string, page: number, data: { data: any[]; total: number }, filters: Record<string, any> = {}) {
		const key = this.getPageCacheKey(slug, page, filters);
		if (!this.pagesCache.has(slug)) {
			this.pagesCache.set(slug, new Map());
		}
		this.pagesCache.get(slug)!.set(key, data);
	}

	getCachedPage(slug: string, page: number, filters: Record<string, any> = {}): { data: any[]; total: number } | null {
		const key = this.getPageCacheKey(slug, page, filters);
		return this.pagesCache.get(slug)?.get(key) ?? null;
	}

	invalidateCachedPages(slug: string) {
		this.pagesCache.delete(slug);
	}

	////


	setCachedFirstPage(slug: string, result: { data: any[]; total: number }) {
		this.firstPageCache.set(slug, result);
	}

	getCachedFirstPage(slug: string): { data: any[]; total: number } | null {
		return this.firstPageCache.get(slug) ?? null;
	}

	invalidateFirstPageCache(slug: string) {
		this.firstPageCache.delete(slug);
	}


	updateCachedFirstPage(slug: string, updater: (current: { data: any[]; total: number }) => { data: any[]; total: number }) {
		const current = this.firstPageCache.get(slug) ?? { data: [], total: 0 };
		const updated = updater(current);
		this.firstPageCache.set(slug, updated);
	}

}