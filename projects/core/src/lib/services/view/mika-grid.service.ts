// 📦 MikaTableService — handles pagination, sorting, filtering, and data binding centrally for MikaTableComponent parts
import { Injectable, computed, inject } from '@angular/core';
import { signal, Signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { MikaApiService } from '../http/mika-api.service';
import { MikaUiService } from './mika-ui.service';
import { firstValueFrom } from 'rxjs';
import { MikaEngineService } from '../engine/mika-engine.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MikaLocalStorageAdapterService } from '../data/mika-localstorage-adapter.service';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular/standalone';
import { MikaColumnConfig } from '../../interfaces/table/mika-column-config.interface';

@Injectable({ providedIn: 'root' })
export class MikaGridService {
	private api = inject(MikaApiService);
	private toast = inject(MikaUiService);
	private mika = inject(MikaEngineService);
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private localAdapter = inject(MikaLocalStorageAdapterService);
	platform = inject(Platform);

	private configReady = signal(false);
	private controlsReady = signal(false);

	data = signal<any[]>([]);
	totalCount = signal(0);
	isLoading = signal(false);
	filters = signal<Record<string, any>>({});

	dataSource = new MatTableDataSource<any>();
	paginator!: MatPaginator;
	sort!: MatSort;

	config = signal<MikaEntityConfig | null>(null);
	isMobile = computed(() => this.isMobileView());
	visibleColumns = computed<MikaColumnConfig[]>(() => this.setVisibleColumns());
	visibleColumnKeys = computed(() => this.visibleColumns().map(c => c.columnDef || c.key));
	finalColumnKeys = computed(() => this.getFinalColumnKeys());
	showActions = computed(() => this.config()?.actions?.show ?? true);
	bulkMode = computed(() => this.config()?.actions?.bulk ?? false);


	init(config: MikaEntityConfig) {
		this.config.set(config);
		this.configReady.set(true);
	}


	setControls(paginator: MatPaginator, sort: MatSort) {
		this.paginator = paginator;
		this.sort = sort;
		this.dataSource.paginator = paginator;
		this.dataSource.sort = sort;
		this.controlsReady.set(true);
	}

	setVisibleColumns() {
		const table = this.config()?.table;
		if (!table) return [];

		const allCols = table.columns ?? [];

		if (this.isMobile() && table.mobileColumns?.length) {
			return allCols.filter(col => table.mobileColumns!.includes(col.key));
		}

		return allCols;
	}

	getFinalColumnKeys() {
		const base = this.visibleColumnKeys();
		const actions = this.showActions() ? ['actions'] : [];
		const select = this.bulkMode() ? ['select'] : [];
		return [...select, ...base, ...actions];
	}

	// methods
	isMobileView(): boolean {
		let isNative = Capacitor.isNativePlatform();
		let capPlatform = Capacitor.getPlatform();
		if (capPlatform === 'web') {
			isNative = this.platform.is('android') || this.platform.is('ios');
		}

		return isNative
	}

	deleteRow() {

	}

	loadData() {

	}

	fetchAllResult() {

	}


}
