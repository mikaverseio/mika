import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
	MikaEntityConfig,
	MikaStorageService,
	MikaActionService,
} from '@mikaverse/core';

import { TableFiltersComponent } from '../table-filters/table-filters.component';
import { MikaLangSwitcherComponent } from '../../switchers/mika-lang-switcher/mika-lang-switcher.component';

@Component({
	selector: 'app-mika-table-header',
	templateUrl: './mika-table-header.component.html',
	styleUrls: ['./mika-table-header.component.scss'],
	imports: [
		TranslatePipe,
		RouterModule,
		CommonModule,
		FormsModule,
		TableFiltersComponent,
		MikaLangSwitcherComponent,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCheckboxModule,
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
