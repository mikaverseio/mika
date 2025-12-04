import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { IonButtons, IonButton, IonIcon, IonContent, IonFooter, IonToolbar, IonHeader, IonTitle, IonLoading, IonAlert, IonChip, IonImg, IonMenuButton, IonProgressBar, IonModal, IonNote } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../pipes/localize';
import { CommonModule } from '@angular/common';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { GetValuePipe } from '../../../pipes/get-value.pipe';
import { PrintComponent } from '../print/print.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MikaStorageService } from '../../../services/infra/mika-storage.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableFiltersComponent } from '../table-filters/table-filters.component';
import { MikaLangSwitcherComponent } from '../../switchers/mika-lang-switcher/mika-lang-switcher.component';
import { MikaActionService } from '../../../services';

@Component({
	selector: 'app-mika-table-header',
	templateUrl: './mika-table-header.component.html',
	styleUrls: ['./mika-table-header.component.scss'],
	imports: [IonTitle, IonHeader, IonToolbar,IonIcon, IonButton, IonButtons,
		TranslatePipe, RouterModule, MatTableModule, MatSortModule, CommonModule, IonMenuButton,
		FormsModule, TableFiltersComponent, MatMenuModule, MatButtonModule, MatButtonToggleModule,
		MatFormFieldModule, MatSelectModule,
		MikaLangSwitcherComponent, MatCheckboxModule
	]
})
export class MikaTableHeaderComponent implements OnInit {
	entityConfig!: MikaEntityConfig
	bulkMode = false;
	selection = new SelectionModel<any>(true, []); // multi-select enabled
	showFilter = signal(true);

	constructor(
		private preferences: MikaStorageService,
		private actions: MikaActionService
	) { }

	ngOnInit() { }

	toggleBulkMode() {
		this.bulkMode = !this.bulkMode;
		if (!this.bulkMode) this.selection.clear();
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

	refresh() {
		// this.paginator.pageIndex = 0;
		// this.updateQueryParam(1);
		// this.loadPage();
		// this.actions.action('refresh').perform(async () => {
		// 	/// perfome things
		// })
	}

	presentPrintModal() {

	}

	onFilterSubmit(e: any) {

	}

}
