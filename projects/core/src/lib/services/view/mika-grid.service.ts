// 📦 MikaGridService — The central reactive store for data listing
import { Injectable, computed, inject } from '@angular/core';
import { signal, Signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

// Imports for Data and State
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { MikaColumnConfig } from '../../interfaces/table/mika-column-config.interface';
import { MikaApiService } from '../http/mika-api.service';
import { MikaUiService } from './mika-ui.service';
import { MikaEngineService } from '../engine/mika-engine.service';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { Mika } from '../../helpers';
import { toObservable } from '@angular/core/rxjs-interop';
import { MikaGridState } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class MikaGridService {
	// ⚙️ Dependencies (Injected)
	private api = inject(MikaApiService);
	private toast = inject(MikaUiService);
	private mika = inject(MikaEngineService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	platform = inject(Platform);

	// 💾 Core State (Private Signals)
	private readonly state = signal<MikaGridState>({
		data: [],
		totalCount: 0,
		isLoading: false,
		filters: {},
		currentPage: 1,
		pageSize: 20, // Default page size
		sortBy: '',
		sortDirection: 'asc',
		isInitialLoad: true,
	});

	private readonly configSignal = signal<MikaEntityConfig | null>(null);
	private readonly isReady = signal(false);

	// 💡 Public Read-only State (Computed/Signals)
	public readonly config = this.configSignal.asReadonly();
	public readonly data = computed(() => this.state().data);
	public readonly totalCount = computed(() => this.state().totalCount);
	public readonly isLoading = computed(() => this.state().isLoading);
	public readonly filters = computed(() => this.state().filters);

	// 🖥️ View Logic Signals (Derived State)
	public readonly isMobile = computed(() => this.isMobileView());
	public readonly visibleColumns = computed<MikaColumnConfig[]>(() => this.setVisibleColumns());
	public readonly visibleColumnKeys = computed(() => this.visibleColumns().map(c => c.columnDef || c.key));
	public readonly showActions = computed(() => this.config()?.actions?.show ?? true);
	public readonly bulkMode = computed(() => this.config()?.actions?.bulk ?? false);

	// The final list of columns to render (select, keys, actions)
	public readonly finalColumnKeys = computed(() => this.getFinalColumnKeys());

	// 🛠️ Control References (Private for internal use, though optional to keep in service)
	private paginatorRef!: MatPaginator;
	private sortRef!: MatSort;

	// --- Core Initialization & Setup Methods ---

	/**
	 * Initializes the service with the entity configuration.
	 * @param config The configuration for the entity/grid.
	 */
	init(config: MikaEntityConfig) {
		if (this.configSignal()?.contentType === config.contentType) {
			// Already initialized with the same config
			return;
		}

		this.configSignal.set(config);
		this.isReady.set(true);
		// Optionally load state from URL query params on init
		this.loadStateFromQueryParams();
	}

	/**
	 * Sets the physical Angular Material controls (called by the Component).
	 * @param paginator The MatPaginator instance.
	 * @param sort The MatSort instance.
	 */
	setControls(paginator: MatPaginator, sort: MatSort): void {
		this.paginatorRef = paginator;
		this.sortRef = sort;

		// Subscribe to control changes to update the state and load data
		this.paginatorRef.page.subscribe(() => {
			this.updateState({
				currentPage: this.paginatorRef.pageIndex + 1,
				pageSize: this.paginatorRef.pageSize
			});
			this.updateUrlParams();
			this.loadPage();
		});

		this.sortRef.sortChange.subscribe(() => {
			// Reset page on sort change
			this.paginatorRef.pageIndex = 0;
			this.updateState({
				currentPage: 1,
				sortBy: this.sortRef.active,
				sortDirection: this.sortRef.direction as 'asc' | 'desc'
			});
			this.updateUrlParams();
			this.loadPage();
		});

		// Apply initial state to controls if needed
		this.paginatorRef.pageIndex = this.state().currentPage - 1;
		this.paginatorRef.pageSize = this.state().pageSize;
		this.sortRef.active = this.state().sortBy;
		this.sortRef.direction = this.state().sortDirection;
	}

	// --- Data Loading & Manipulation Methods ---

	/**
	 * Loads a page of data based on the current state (filters, sort, page).
	 */
	async loadPage(): Promise<void> {
		if (!this.isReady()) return;

		const config = this.config();
		if (!config) return;

		this.updateState({ isLoading: true });

		const currentState = this.state();
		const params: Record<string, any> = {
			page: currentState.currentPage,
			take: currentState.pageSize,
			// Include sort/filter params based on API convention
			// E.g., 'sort': `${currentState.sortBy}:${currentState.sortDirection}`,
			...currentState.filters,
		};

		// **Caching Logic (Simplified)**
		// const cacheKey = JSON.stringify(params);
		// if (config.request?.cache) { /* ... check cache ... */ }

		try {
			const response = await firstValueFrom(this.api.config(config).get(params).pipe(
				// Add a small delay for better UX on fast loads
				// delay(currentState.isInitialLoad ? 0 : 300),
				// Set isInitialLoad to false after the first successful load
				tap(() => { if (currentState.isInitialLoad) this.updateState({ isInitialLoad: false }); })
			));

			// Extract data and total count
			const dataProp = config.response?.props?.data ?? Mika.settings?.responseProps?.data;
			const totalProp = config.response?.props?.total ?? Mika.settings?.responseProps?.total ?? 'total';
			const data = dataProp ? response[dataProp] : response;
			const total = response[totalProp] ?? (Array.isArray(response) ? response.length : 0);

			this.updateState({
				data: data,
				totalCount: total,
				isLoading: false,
			});

		} catch (error) {
			console.error('Grid Service Data Loading Error:', error);
			this.updateState({ isLoading: false, data: [], totalCount: 0 });
			this.toast.showToast('data-loading-error', 'danger');
		}
	}

	/**
	 * Updates the filters and triggers a data reload from page 1.
	 * @param newFilters The new filter values.
	 */
	applyFilters(newFilters: Record<string, any>): void {
		this.updateState({ filters: newFilters, currentPage: 1 });
		this.paginatorRef.pageIndex = 0; // Reset paginator control
		this.updateUrlParams();
		this.loadPage();
	}

	/**
	 * Clears all filters and resets to page 1.
	 */
	resetGrid(): void {
		this.updateState({ filters: {}, currentPage: 1, sortBy: '', sortDirection: 'asc' });
		this.paginatorRef.pageIndex = 0;
		this.sortRef.active = '';
		this.sortRef.direction = 'asc';
		this.router.navigate([], { queryParams: {}, relativeTo: this.route });
		this.loadPage();
	}

	/**
	 * Reloads the current page of data.
	 */
	refresh(): void {
		this.loadPage();
	}

	// --- State and URL Management ---

	private updateState(partialState: Partial<MikaGridState>): void {
		this.state.update(current => ({ ...current, ...partialState }));
	}

	/**
	 * Syncs the current grid state (page, sort, filters) to the URL query parameters.
	 */
	private updateUrlParams(): void {
		const state = this.state();
		const queryParams: Record<string, any> = {
			page: state.currentPage,
			pageSize: state.pageSize,
			sortBy: state.sortBy || undefined,
			sortDir: state.sortDirection || undefined,
			...state.filters,
		};

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			queryParamsHandling: 'merge'
		});
	}

	/**
	 * Loads initial state from URL query parameters.
	 */
	/**
 * Loads initial state from URL query parameters and subscribes to future changes.
 */
	private loadStateFromQueryParams(): void {
		// Standard reactive subscription to the route parameters
		this.route.queryParamMap.subscribe(params => {
			const page = parseInt(params.get('page') || '1', 10);
			const pageSize = parseInt(params.get('pageSize') || '20', 10);
			const sortBy = params.get('sortBy') || '';
			const sortDirection = (params.get('sortDir') as 'asc' | 'desc') || 'asc';

			// Extract filters by excluding standard pagination/sort keys
			const excludedKeys = ['page', 'pageSize', 'sortBy', 'sortDir'];
			const filterKeys = Array.from(params.keys).filter(k => !excludedKeys.includes(k));
			const filters = filterKeys.reduce((acc, key) => ({ ...acc, [key]: params.get(key) }), {});

			// Check if the state actually changed before updating and reloading
			const currentState = this.state();

			// This is a simplified check. In a real app, you'd compare all state properties.
			const stateChanged = currentState.currentPage !== page ||
				currentState.sortBy !== sortBy ||
				JSON.stringify(currentState.filters) !== JSON.stringify(filters);

			this.updateState({
				currentPage: page,
				pageSize: pageSize,
				sortBy: sortBy,
				sortDirection: sortDirection,
				filters: filters
			});

			// Synchronize the component controls with the state from the URL
			if (this.paginatorRef && this.sortRef) {
				this.paginatorRef.pageIndex = page - 1;
				this.paginatorRef.pageSize = pageSize;
				this.sortRef.active = sortBy;
				this.sortRef.direction = sortDirection as 'asc' | 'desc';
			}

			// Only load data if the state derived from the URL has changed
			// or if it's the initial load.
			if (currentState.isInitialLoad || stateChanged) {
				this.loadPage();
			}
		});
	}

	// --- Computed View Helper Methods ---

	private isMobileView(): boolean {
		let isNative = Capacitor.isNativePlatform();
		let capPlatform = Capacitor.getPlatform();
		if (capPlatform === 'web') {
			isNative = this.platform.is('android') || this.platform.is('ios');
		}
		return isNative;
	}

	private setVisibleColumns(): MikaColumnConfig[] {
		const table = this.config()?.table;
		if (!table) return [];

		const allCols = table.columns ?? [];

		// Apply mobile column filtering logic if specified
		const baseCols = this.isMobile() && table.mobileColumns?.length
			? allCols.filter(c => table.mobileColumns!.includes(c.key))
			: allCols;

		return baseCols;
	}

	private getFinalColumnKeys(): string[] {
		const base = this.visibleColumnKeys();
		const actions = this.showActions() ? ['actions'] : [];
		const select = this.bulkMode() ? ['select'] : [];
		return [...select, ...base, ...actions];
	}

	// --- Data Source Helper for MatTableComponent ---

	/**
	 * Provides an observable to bind data to the MatTableDataSource.
	 * The table component will use the `async` pipe.
	 */
	public get tableDataSource$(): Observable<any[]> {
    // Correctly convert the Signal into an Observable
		return toObservable(this.data).pipe(
			map(data => data || []) // Ensure it's always an array
		);
	}
}
