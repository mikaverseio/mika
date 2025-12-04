import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, signal, inject, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Platform, IonButtons, IonButton, IonIcon, IonContent, IonFooter, IonToolbar, IonHeader, IonTitle, IonLoading, IonAlert, IonChip, IonImg, IonMenuButton, IonProgressBar, IonModal, IonNote, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../pipes/localize';
import { MikaColumnConfig } from '../../../interfaces/table/mika-column-config.interface';
import { MikaApiService } from '../../../services/http/mika-api.service';
import { debounceTime, firstValueFrom, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MikaUiService } from '../../../services/view/mika-ui.service';
import { addIcons } from 'ionicons';
import { create, trash, addCircle, reloadOutline, refreshCircle, swapVertical, download, print, listCircle, arrowDownCircle, reloadCircle, removeCircle, filterCircleOutline, filterCircle, eye, closeCircle, ellipsisVertical, ellipsisVerticalSharp, ellipsisHorizontalCircleSharp, ellipsisVerticalCircleSharp, link, createOutline, closeCircleOutline, cloudUpload, cloudDownload, trashOutline, cloudDownloadOutline } from 'ionicons/icons';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { MikaDataService } from '../../../services/data/mika-data.service';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MikaFormBuilderService } from '../../../services/view/mika-form-builder.service';
import { printHtml } from '../../../utils/utils';
import { GetValuePipe } from '../../../pipes/get-value.pipe';
import { PrintComponent } from '../print/print.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MikaEngineService } from '../../../services/engine/mika-engine.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MikaStorageService } from '../../../services/infra/mika-storage.service';
import { MikaLocalStorageAdapterService } from '../../../services/data/mika-localstorage-adapter.service';
import { Mika } from '../../../helpers/mika-app.helper';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Capacitor } from '@capacitor/core';
import { TableFiltersComponent } from '../table-filters/table-filters.component';
import { MikaLangSwitcherComponent } from '../../switchers/mika-lang-switcher/mika-lang-switcher.component';
import { MikaActionService } from '../../../services';

@Component({
	selector: 'mika-table-mobile',
	templateUrl: './mika-table-mobile.component.html',
	styleUrls: ['./mika-table-mobile.component.scss'],
	standalone: true,
	imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonLabel, IonItem, IonList, IonNote,
		IonImg, IonChip, IonTitle, IonHeader, IonToolbar, IonContent, IonIcon, IonButton, IonButtons, LocalizePipe,
		TranslatePipe, RouterModule, MatTableModule, MatSortModule, CommonModule, IonLoading, IonAlert, IonMenuButton,
		FormsModule, TableFiltersComponent, MatMenuModule, MatButtonModule, GetValuePipe, MatButtonToggleModule,
		MatFormFieldModule, MatSelectModule,
		MikaLangSwitcherComponent, MatCheckboxModule
	]
})
export class MikaTableMobileComponent implements OnInit {
	@Input() entityConfig!: MikaEntityConfig;
	@Input() items: any[] = [];
	@Input() showActions: boolean = true;

	@Input() displayedColumns: MikaColumnConfig[] = [];
	@Output() deleteClicked = new EventEmitter<any>();

	@ViewChild('deleteAlert') deleteAlert!: IonAlert;
	@ViewChild(IonLoading) loading!: IonLoading;
	@ViewChild('printSection') printSection!: ElementRef;
	@ViewChild('gridRef') gridRef!: ElementRef;
	@ViewChild('printModal') printModal!: IonModal;

	dataSource: any = new MatTableDataSource<any>();
	totalCount = 0;
	totalPages = 0;
	keyword!: string;
	error: any = null;
	isLoading = signal(false);
	showFilter = signal(true);
	isPrinting: boolean = false;
	printData: any[] = [];
	printMode: string = 'page';
	fieldMode: string = 'all';
	selectedPrintFields: string[] = [];
	api = inject(MikaApiService);
	app = inject(MikaUiService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	dataService = inject(MikaDataService);
	formBuilder = inject(MikaFormBuilderService);
	mika = inject(MikaEngineService);
	cdr = inject(ChangeDetectorRef);
	preferences = inject(MikaStorageService);
	localAdapter = inject(MikaLocalStorageAdapterService);
	actions = inject(MikaActionService);
	platform = inject(Platform);

	filterValues: any = {};
	filterOptions: Record<string, any[]> = {};

	bulkMode = false;
	selection = new SelectionModel<any>(true, []); // multi-select enabled

	isNative: boolean = false;

	page = 1;
	take = 20;

	constructor() {
		this.isNative = Capacitor.isNativePlatform();
		let capPlatform = Capacitor.getPlatform();
		if (capPlatform === 'web') {
			this.isNative = this.platform.is('android') || this.platform.is('ios');
		}
		addIcons({ filterCircle, filterCircleOutline, reloadCircle, listCircle, addCircle, cloudDownload, cloudUpload, trashOutline, cloudDownloadOutline, closeCircleOutline, trash, create, eye, ellipsisVerticalCircleSharp, closeCircle, arrowDownCircle, print, download, link, createOutline, ellipsisVerticalSharp, ellipsisVertical, ellipsisHorizontalCircleSharp, removeCircle, refreshCircle, swapVertical, reloadOutline });
		this.initFilterState();
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

	}

	presentPrintModal() {
		this.printModal.present();
		this.isPrinting = true;
		this.printData = this.dataSource.data;
	}

	get printableColumns() {
		return this.entityConfig.table.columns.filter(col =>
			this.fieldMode === 'all' || this.selectedPrintFields.includes(col.key)
		);
	}

	togglePrintMode(e: any) {
		this.printMode = e.value;
		if (this.printMode === 'page') {
			this.printData = this.dataSource.data;
		} else {
			this.loading.present();
			this.fetchAllResults().then(all => {
				this.printData = all;
				this.loading.dismiss();
				this.cdr.detectChanges();
			}).catch((err) => {
				this.loading.dismiss();
			});
		}
	}

	toggleFieldMode(e: any) {
		this.fieldMode = e.value;
		if (this.fieldMode === 'custom') {
			this.selectedPrintFields = this.entityConfig.table.columns.map(c => c.key);
		}
	}

	print() {
		printHtml(this.printSection.nativeElement.innerHTML);
	}

	closePrintModal() {
		this.printModal.dismiss();
	}

	onPrintModalWillDismiss(e: any) {
		this.isPrinting = false;
	}

	async ngOnInit() {
		if (this.items?.length) {
			this.dataSource = this.items;
			this.totalCount = this.items.length;
		}
	}

	ngAfterViewInit(): void {
		if (!this.items?.length) {
			this.loadPage();
		}

		this.onFilterChange();
	}

	async applyFilters() {
		this.loadPage();
	}

	async loadPage() {
		let params: any = {
			page: this.page,
			take: this.take || 20,
		};

		if (this.filterValues) {
			params = { ...params, ...this.filterValues };
		}

		try {
			this.isLoading.set(true);

			if (this.entityConfig.request?.cache) {
				const cached = this.mika.cache.getCachedPage(this.entityConfig.contentType, params.page, this.filterValues);
				if (cached) {
					this.items = cached.data;
					this.totalCount = cached.total;
					this.isLoading.set(false);
					return;
				}
			}

			this.isLoading.set(true);

			let response;
			// if (this.entityConfig.endpoint === 'localStorage') {
			// 	response = await this.localAdapter.list(this.entityConfig.contentType, this.filterValues, params);
			// } else {
			// 	response = await firstValueFrom(this.api.config(this.entityConfig).get(params));
			// }
			response = await firstValueFrom(this.api.config(this.entityConfig).get(params));
			const dataProp = this.entityConfig.response?.props?.data ?? Mika.settings?.responseProps?.data;
			const source = dataProp ? response[dataProp] : response;
			this.items = this.items.concat(source);
			this.totalCount = response.total;
			this.totalPages = response.last_page;

			if (this.entityConfig.request?.cache) {
				this.mika.cache.setCachedPage(this.entityConfig.contentType, params.page, {
					data: response.data,
					total: response.total
				}, this.filterValues);
			}

		} catch (error) {
			this.error = error;
			this.app.showToast('something went wrong', 'danger');
		} finally {
			setTimeout(() => {
				this.isLoading.set(false);
			}, 500);
		}

	}

	async fetchAllResults() {
		const params = { ...this.filterValues };
		if (this.entityConfig.endpoints?.allResults) {
			return await firstValueFrom(this.api.config(this.entityConfig).custom(this.entityConfig.endpoints?.allResults.replace(this.entityConfig.endpoints?.get!, ''), params));
		} else if (this.entityConfig.request?.allResultsParam) {
			params[this.entityConfig.request.allResultsParam] = true;
			return await firstValueFrom(this.api.config(this.entityConfig).get(params));
		}
		return await firstValueFrom(this.api.config(this.entityConfig).custom('all', params));
	}

	updateQueryParam(page: number) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { page },
			queryParamsHandling: 'merge'
		});
	}

	refresh() {
		this.updateQueryParam(1);
		this.loadPage();
	}

	async onIonInfinite(e: any) {
		this.page++
		await this.loadPage();
		e.target.complete();
		if (this.page >= this.totalPages) {
			e.target.disabled = true;
		}
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
		await this.deleteAlert.present();
		const role = (await this.deleteAlert.onDidDismiss()).role;

		if (role === 'confirm') {
			await this.loading.present();
			const id = this.entityConfig.table.idColumn ? item[this.entityConfig.table.idColumn] : item.id;
			this.api.config(this.entityConfig).delete(id).subscribe({
				next: (res: any) => {
					this.loading.dismiss();

					if (res.success) {
						const index = this.dataSource.data.findIndex((_item: any) => _item.id === item.id);
						if (index > -1) {
							// Remove item from internal array
							this.dataSource.data.splice(index, 1);
							// Reassign the same array to trigger change detection
							this.dataSource.data = [...this.dataSource.data];
						}
						this.app.openSnackBar('item-successfully-deleted', 'success');
					} else {
						this.app.showToast('mf-something-wrong', 'danger');
					}
				},
				error: () => {
					this.loading.dismiss();
					this.app.showToast('mf-something-wrong', 'danger');
				},
			});
		}
	}
}
