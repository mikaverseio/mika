import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges, SimpleChanges, AfterViewInit, signal, inject, Injector, runInInjectionContext, ChangeDetectorRef, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, map } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

// Core imports via package alias to keep UI library decoupled
import {
	MikaColumnConfig,
	MikaEntityConfig,
	MikaStorageService,
	MikaGridService,
	MikaI18nService,
	MikaAuthService,
} from '@mikaverse/core';
import { MikaUiService } from '../../../services/mika-ui.service';
import { MikaFormBuilderService } from '../../../services/mika-form-builder.service';

// Local UI components
import { TableFiltersComponent } from '../table-filters/table-filters.component';
import { MikaPrintExportModalComponent } from '../mika-print-export-modal/mika-print-export-modal.component';
import { LocalizePipe } from '../../../pipes/localize.pipe';
import { GetValuePipe } from '../../../pipes/get-value.pipe';

@Component({
	selector: 'mika-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	standalone: true,
	imports: [
		TranslatePipe,
		MatPaginator,
		MatSort,
		RouterModule,
		MatTableModule,
		MatSortModule,
		CommonModule,
		FormsModule,
		TableFiltersComponent,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatCheckboxModule,
		MatToolbarModule,
		MatIconModule,
		MatProgressBarModule,
		MatChipsModule,
		MatDialogModule,
		LocalizePipe,
		GetValuePipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MikaTableComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() entityConfig!: MikaEntityConfig;
	@Input() items: any[] = [];
	@Input() showActions: boolean = true;

	@Input() displayedColumns: MikaColumnConfig[] = [];
	@Output() deleteClicked = new EventEmitter<any>();
	@ViewChild(MatPaginator) paginator?: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	dataSource: any = new MatTableDataSource<any>();
	totalCount = 0;
	error: any = null;
	isLoading = signal(false);
	showFilter = signal(true);
	app = inject(MikaUiService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	formBuilder = inject(MikaFormBuilderService);
	cdr = inject(ChangeDetectorRef);
	preferences = inject(MikaStorageService);
	grid = inject(MikaGridService);
	destroyRef = inject(DestroyRef);
	auth = inject(MikaAuthService);
	dialog = inject(MatDialog);
	private injector = inject(Injector);
	isNative = false;

	filterValues: any = {};
	filterOptions: Record<string, any[]> = {};

	bulkMode = false;
	selection = new SelectionModel<any>(true, []); // multi-select enabled

	languageService = inject(MikaI18nService);
	selectedLocale = this.languageService.tableLocalSignal;

	constructor() {
		this.initFilterState();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['entityConfig'] && !changes['entityConfig'].firstChange) {
			this.dataSource.data = [];
			this.totalCount = 0;
			this.filterValues = {};
			this.selection.clear();
			this.grid.init(this.entityConfig);
			this.loadPage();
		}
	}

	get hasSelection(): boolean {
		return this.selection.hasValue();
	}

	toggleBulkMode() {
		this.bulkMode = !this.bulkMode;
		if (!this.bulkMode) this.selection.clear();
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach((row: any) => this.selection.select(row));
	}

	checkboxLabel(row?: any): string {
		if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
	}

	async bulkDelete() {
		return;

		// for (const item of this.selection.selected) {
		// 	const id = this.entityConfig.tableIdColumn ? item[this.entityConfig.tableIdColumn] : item.id;
		// 	await firstValueFrom(this.api.config(this.entityConfig).delete(id));
		// }

		// this.app.openSnackBar('items-deleted', 'success');
		// this.selection.clear();
		// this.loadPage();
	}

	async initFilterState() {
		const show = await this.preferences.get('showFilter');
		this.showFilter.set(show);
	}

	toggleFilter() {
		const showFilter = this.showFilter();
		this.showFilter.set(!showFilter);
		this.preferences.set('showFilter', !showFilter);
	}

	export(type: string = '') {
		const ref = this.dialog.open(MikaPrintExportModalComponent, {
			width: '90vw',
			maxWidth: '900px',
			panelClass: 'mika-print-export-dialog',
		});
		ref.componentInstance.entityConfig = this.entityConfig;
		ref.componentInstance.dataSource = this.dataSource;
		ref.componentInstance.filterValues = this.filterValues;
		ref.componentInstance.printData = this.dataSource.data ?? [];
	}

	async ngOnInit() {
		this.grid.init(this.entityConfig);

		runInInjectionContext(this.injector, () => {
			toObservable(this.grid.data)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe(data => {
					this.dataSource.data = data;
					this.dataSource.sort = this.sort;
					this.totalCount = this.grid.totalCount();
					if (this.paginator) {
						this.paginator.length = this.totalCount;
					}
					this.cdr.markForCheck();
				});

			toObservable(this.grid.isLoading)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe(loading => this.isLoading.set(loading));
		});
	}

	ngAfterViewInit(): void {
		if (this.paginator) {
			this.grid.setPageSize(this.paginator.pageSize || 20);
			this.grid.setPage(this.paginator.pageIndex + 1);
		}

		if (!this.items?.length) {
			this.loadPage();
		}

		this.paginator?.page.subscribe(() => {
			this.updateQueryParam((this.paginator?.pageIndex ?? 0) + 1);
			this.grid.setPage((this.paginator?.pageIndex ?? 0) + 1);
			this.grid.setPageSize(this.paginator?.pageSize ?? 20);
			this.loadPage();
		});

		this.sort.sortChange.subscribe(() => {
			if (this.paginator) this.paginator.pageIndex = 0;
			this.updateQueryParam(1);
			this.grid.setSort(this.sort.active, this.sort.direction as any);
			this.loadPage();
		});

		this.route.queryParamMap.subscribe(params => {
			const pageFromUrl = parseInt(params.get('page') || '1', 10);
			if (this.paginator) {
				this.paginator.pageIndex = pageFromUrl - 1;
			}
			this.loadPage();
		});

		this.onFilterChange();
	}

	async applyFilters() {
		this.loadPage();
	}

	async loadPage() {
		this.grid.setPage((this.paginator?.pageIndex ?? 0) + 1);
		this.grid.setPageSize(this.paginator?.pageSize ?? 20);
		if (this.filterValues) {
			this.grid.setFilters(this.filterValues);
		}
		await this.grid.loadPage();
	}

	async fetchAllResults() {
		return await this.grid.fetchAll(this.filterValues);
	}

	updateQueryParam(page: number) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { page },
			queryParamsHandling: 'merge'
		});
	}

	refresh() {
		if (this.paginator) this.paginator.pageIndex = 0;
		this.updateQueryParam(1);
		this.grid.setPage(1);
		this.loadPage();
	}

	onFilterChange() {
		this.formBuilder.filterChanges$
			.pipe(debounceTime(300), map((params: any) => this.formatFilterValues(params)))
			.subscribe((formattedParams) => this.loadFilteredData(formattedParams));
	}

	onFilterSubmit(params: any) {
		this.loadFilteredData(this.formatFilterValues(params));
	}

	loadFilteredData(params: any) {
		this.filterValues = params;

		this.grid.setFilters(params);
		if (this.paginator) this.paginator.pageIndex = 0;
		this.refresh();
		this.router.navigate([], {
			queryParams: params,
			queryParamsHandling: 'merge',
			replaceUrl: true
		});
	}

	formatFilterValues(params: any) {
		const formatted: Record<string, any> = {};
		for (const filter of this.entityConfig.table.filters ?? []) {
			const value = params[filter.key];
			const key = filter.key;

			if (value === null || value === undefined || value === '') continue;

			if (filter.transformValue) {
				formatted[key] = filter.transformValue(value);
			} else {
				formatted[key] = value;
			}
		}
		return formatted;
	}

	onDelete(item: any) {
		this.deleteClicked.emit(item);
	}

	get visibleColumnKeys(): string[] {
		const config = this.entityConfig.table;
		const allColumns = config.columns ?? [];

		// Filtered base columns
		const baseCols = this.isNative && config.mobileColumns?.length
			? allColumns.filter(c => config.mobileColumns!.includes(c.key))
			: allColumns;

		const keys = baseCols.map(c => c.columnDef || c.key);

		const actionCol = this.showActions ? ['actions'] : [];
		const selectCol = this.bulkMode ? ['select'] : [];

		return [...selectCol, ...keys, ...actionCol];
	}

	async delete(item: any) {
		// this.actions.action(EMikaAction.DELETE)
		// Deletion confirmation/toast would be handled by UI adapters; stubbed here.
		this.deleteClicked.emit(item);
	}
}
