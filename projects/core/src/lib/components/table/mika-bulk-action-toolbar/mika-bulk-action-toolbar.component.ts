import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, signal, inject, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonButtons, IonButton, IonIcon, IonContent, IonFooter, IonToolbar, IonHeader, IonTitle, IonLoading, IonAlert, IonChip, IonImg, IonMenuButton, IonProgressBar, IonModal, IonNote } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../pipes/localize';

import { MikaApiService } from '../../../services/http/mika-api.service';

import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/general/app.service';

import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { MikaDataService } from '../../../services/mika-data.service';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MikaFormBuilderService } from '../../../services/form/mika-form-builder.service';
import { GetValuePipe } from '../../../pipes/get-value.pipe';
import { PrintComponent } from '../print/print.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MikaEngineService } from '../../../services/mika-engine.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MikaPreferencesService } from '../../../services/mika-preferences.service';
import { MikaLocalStorageAdapterService } from '../../../services/mika-localstorage-adapter.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableFiltersComponent } from '../table-filters/table-filters.component';
import { MikaLangSwitcherComponent } from '../../switchers/mika-lang-switcher/mika-lang-switcher.component';

@Component({
	selector: 'app-mika-bulk-action-toolbar',
	templateUrl: './mika-bulk-action-toolbar.component.html',
	styleUrls: ['./mika-bulk-action-toolbar.component.scss'],
	imports: [IonNote,
		IonToolbar, IonIcon, IonButton, IonButtons,
		TranslatePipe, RouterModule, MatTableModule, MatSortModule, CommonModule,
		FormsModule, MatMenuModule, MatButtonModule, MatButtonToggleModule,
		MatFormFieldModule, MatSelectModule, MatCheckboxModule
	]
})
export class MikaBulkActionToolbarComponent implements OnInit {
	entityConfig!: MikaEntityConfig;
	dataSource: any = new MatTableDataSource<any>();
	totalCount = 0;
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
	toast = inject(ToastService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	dataService = inject(MikaDataService);
	formBuilder = inject(MikaFormBuilderService);
	mika = inject(MikaEngineService);
	cdr = inject(ChangeDetectorRef);
	preferences = inject(MikaPreferencesService);
	localAdapter = inject(MikaLocalStorageAdapterService);

	filterValues: any = {};
	filterOptions: Record<string, any[]> = {};

	bulkMode = false;
	selection = new SelectionModel<any>(true, []); // multi-select enabled
	constructor() { }

	ngOnInit() { }

	get hasSelection(): boolean {
		return this.selection.hasValue();
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

}
