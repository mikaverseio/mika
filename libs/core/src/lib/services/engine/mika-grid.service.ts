// 📦 MikaGridService — headless data grid state & loader (UI agnostic)
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { MikaEntityConfig, MikaGridState } from '../../schema';
import { MikaApiService } from '../http/mika-api.service';
import { MikaEngineService } from './mika-engine.service';
import { Mika } from '../../helpers';

type SortDirection = 'asc' | 'desc';
type GridQueryParams = { page: number; take: number; sort?: string } & Record<string, any>;

@Injectable({ providedIn: 'root' })
export class MikaGridService {
	// ⚙️ Dependencies (UI-free)
	private api = inject(MikaApiService);
	private engine = inject(MikaEngineService);

	// 💾 Core State
	private readonly state = signal<MikaGridState & { error: any | null }>({
		data: [],
		totalCount: 0,
		isLoading: false,
		filters: {},
		currentPage: 1,
		pageSize: 20,
		sortBy: '',
		sortDirection: 'asc',
		isInitialLoad: true,
		error: null,
	});

	private readonly configSignal = signal<MikaEntityConfig | null>(null);
	private readonly isReady = signal(false);

	// 🔍 Selectors
	config = this.configSignal.asReadonly();
	data = computed(() => this.state().data);
	totalCount = computed(() => this.state().totalCount);
	isLoading = computed(() => this.state().isLoading);
	filters = computed(() => this.state().filters);
	page = computed(() => this.state().currentPage);
	pageSize = computed(() => this.state().pageSize);
	sort = computed(() => ({ by: this.state().sortBy, dir: this.state().sortDirection }));
	error = computed(() => this.state().error);

	// Observable view for async pipes
	data$ = toObservable(this.data);

	// --- Lifecycle ---
	init(config: MikaEntityConfig, initialState: Partial<MikaGridState> = {}) {
		// Re-init only when contentType changes
		if (this.configSignal()?.contentType === config.contentType && this.isReady()) return;

		this.configSignal.set(config);
		this.isReady.set(true);
		this.reset(initialState);
	}

	reset(partial: Partial<MikaGridState> = {}) {
		this.state.set({
			data: [],
			totalCount: 0,
			isLoading: false,
			filters: {},
			currentPage: 1,
			pageSize: 20,
			sortBy: '',
			sortDirection: 'asc',
			isInitialLoad: true,
			error: null,
			...partial,
		});
	}

	// --- Mutators (UI layer can bind controls to these) ---
	setPage(page: number) {
		this.updateState({ currentPage: page });
	}

	setPageSize(size: number) {
		this.updateState({ pageSize: size, currentPage: 1 });
	}

	setSort(sortBy: string, sortDirection: SortDirection = 'asc') {
		this.updateState({ sortBy, sortDirection, currentPage: 1 });
	}

	setFilters(filters: Record<string, any>) {
		this.updateState({ filters, currentPage: 1 });
	}

	// --- Data Loading ---
	async loadPage(extraParams: Record<string, any> = {}): Promise<void> {
		if (!this.isReady()) return;
		const config = this.configSignal();
		if (!config) return;

		this.updateState({ isLoading: true, error: null });

		const currentState = this.state();
		const params: GridQueryParams = {
			page: currentState.currentPage,
			take: currentState.pageSize,
			...(currentState.sortBy ? { sort: `${currentState.sortBy}:${currentState.sortDirection}` } : {}),
			...currentState.filters,
			...extraParams,
		};

		// Cache (optional)
		if (config.request?.cache) {
			const cached = this.engine.cache.getCachedPage(config.contentType, params.page, currentState.filters);
			if (cached) {
				this.updateState({
					data: cached.data,
					totalCount: cached.total,
					isLoading: false,
					isInitialLoad: false,
				});
				return;
			}
		}

		try {
			const response = await firstValueFrom(
				this.api.config(config).get(params)
			);

			const dataProp = config.response?.props?.data;
			const totalProp = config.response?.props?.total ?? 'total';
			const data = dataProp ? response[dataProp] : response;
			const total = response[totalProp] ?? (Array.isArray(response) ? response.length : 0);

			this.updateState({
				data,
				totalCount: total,
				isLoading: false,
				isInitialLoad: false,
			});

			if (config.request?.cache) {
				this.engine.cache.setCachedPage(config.contentType, params.page, { data, total }, currentState.filters);
			}
		} catch (error) {
			console.error('[MikaGrid] loadPage error', error);
			this.updateState({ isLoading: false, error, data: [], totalCount: 0 });
		}
	}

	async fetchAll(extraParams: Record<string, any> = {}): Promise<any[]> {
		if (!this.isReady()) return [];
		const config = this.configSignal();
		if (!config) return [];

		const params = { ...this.state().filters, ...extraParams };
		if (config.endpoints?.allResults) {
			return await firstValueFrom(
				this.api.config(config).custom(
					config.endpoints.allResults.replace(config.endpoints?.get ?? '', ''),
					params
				)
			);
		}

		if (config.request?.allResultsParam) {
			params[config.request.allResultsParam] = true;
			return await firstValueFrom(this.api.config(config).get(params));
		}

		return await firstValueFrom(this.api.config(config).custom('all', params));
	}

	refresh() {
		return this.loadPage();
	}

	// --- Helpers ---
	private updateState(partial: Partial<MikaGridState & { error: any | null }>) {
		this.state.update(current => ({ ...current, ...partial }));
	}
}
