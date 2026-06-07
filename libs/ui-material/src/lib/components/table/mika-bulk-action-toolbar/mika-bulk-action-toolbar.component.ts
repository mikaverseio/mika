import { Component, OnInit, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { MikaEntityConfig } from '@mikaverse/core';
import { MikaUiService } from '../../../services/mika-ui.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
	selector: 'app-mika-bulk-action-toolbar',
	templateUrl: './mika-bulk-action-toolbar.component.html',
	styleUrls: ['./mika-bulk-action-toolbar.component.scss'],
	imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class MikaBulkActionToolbarComponent implements OnInit {
	entityConfig!: MikaEntityConfig;
	toast = inject(MikaUiService);

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
