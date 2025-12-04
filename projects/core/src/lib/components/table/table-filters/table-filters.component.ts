import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MikaDataService } from '../../../services/data/mika-data.service';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { MikaAutocompleteFieldComponent } from '../../../fields/mika-autocomplete-field.component';
import { MikaFormBuilderService } from '../../../services/view/mika-form-builder.service';
import { MikaFilterConfig } from '../../../interfaces/field/mika-filter-config.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'ionicons/dist/types/stencil-public-runtime';


@Component({
	selector: 'app-table-filters',
	templateUrl: './table-filters.component.html',
	styleUrls: ['./table-filters.component.scss'],
	providers: [DatePipe],
	imports: [
		FormsModule, CommonModule,

		TranslatePipe, MatAccordion, MatExpansionModule, MatFormFieldModule, MatSelectModule,
		MatCheckboxModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, IonButton,
		MatFormFieldModule, MatInputModule, MatOption, MatSlideToggleModule, MatMenuModule, MatButtonModule, MatAutocompleteModule,
		MikaAutocompleteFieldComponent
	],
})
export class TableFiltersComponent implements OnInit {
	@Input() entityConfig!: MikaEntityConfig;
	@Input() expandable:boolean = false;
	@Input() sticky: boolean = false;
	@Output() onSearch = new EventEmitter<any>();
	@Output() onSubmit = new EventEmitter<any>();

 	filterForm = new FormGroup({});
	filterValues: any = {};
	filterOptions: Record<string, any[]> = {};

	dataService = inject(MikaDataService);
	formBuilder = inject(MikaFormBuilderService);
	route = inject(ActivatedRoute);
	router = inject(Router);

	constructor() { }

	async ngOnInit() {
		await this.initFilterForm();

		const queryParams = this.route.snapshot.queryParams;

		this.filterForm.patchValue(queryParams, { emitEvent: false });

		this.onSubmit.emit(this.filterForm.value);
	}

	async initFilterForm() {
		const searchField: MikaFilterConfig = {
			key: 'key',
			label: 'search',
			type: 'text'
		};

		this.entityConfig.table.filters ??= [];

		const hasSearchField = this.entityConfig.table.filters.some(f => f.key === 'key');
		if (this.entityConfig.actions.items?.search && !hasSearchField) {
			this.entityConfig.table.filters.unshift(searchField);
		}

		const fields = this.entityConfig.table.filters;

		if (fields.length) {
			this.filterForm = this.formBuilder.initForm(fields, 'list', this.entityConfig.localizable ?? false);
			const effectMode = this.entityConfig.table.filterSubmitMode === 'onChange' || this.entityConfig.table.filterSubmitMode == null ? true : false;
			await this.formBuilder.enhanceFields(this.filterForm, fields, 'list', effectMode);
		}
	}

	get groupedFilters(): Array<{ key: string; filters: MikaFilterConfig[] }> {
		const groups: Record<string, MikaFilterConfig[]> = {};

		for (const filter of this.entityConfig.table.filters || []) {
			const groupKey = filter.group || 'General';
			if (!groups[groupKey]) groups[groupKey] = [];
			groups[groupKey].push(filter);
		}

		return Object.entries(groups).map(([key, filters]) => ({ key, filters }));
	}


	onFilterChange(filter: MikaFilterConfig) {
		if (filter.onChange) filter.onChange(this.filterForm);
	}

	submit() {
		this.onSubmit.emit(this.filterForm.value);
	}


}
