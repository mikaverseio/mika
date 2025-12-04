import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { IonButtons, IonButton, IonIcon, IonContent, IonFooter, ModalController, IonToolbar, IonHeader, IonTitle, IonLoading, IonAlert, IonChip, IonImg, IonMenuButton, IonProgressBar, IonModal, IonNote } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../pipes/localize';
import { MikaApiService } from '../../../services/http/mika-api.service';
import { CommonModule } from '@angular/common';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { MikaDataService } from '../../../services/data/mika-data.service';
import { FormsModule } from '@angular/forms';
import { TableFiltersComponent } from "../table-filters/table-filters.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { printHtml } from '../../../utils/utils';
import { GetValuePipe } from '../../../pipes/get-value.pipe';
import { PrintComponent } from '../print/print.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MikaLoading } from '../../../services/data/mika-loading.service';
import { firstValueFrom } from 'rxjs';
import { MikaLangSwitcherComponent } from '../../switchers/mika-lang-switcher/mika-lang-switcher.component';
@Component({
	selector: 'app-mika-print-export-modal',
	templateUrl: './mika-print-export-modal.component.html',
	styleUrls: ['./mika-print-export-modal.component.scss'],
	imports: [
		IonTitle, IonHeader, IonToolbar, IonContent, IonIcon, IonButton, IonButtons,
		TranslatePipe, RouterModule, MatTableModule, MatSortModule, CommonModule,
		FormsModule, MatMenuModule, MatButtonModule, PrintComponent, MatButtonToggleModule,
		MatFormFieldModule, MatSelectModule,
		MatCheckboxModule
	]
})
export class MikaPrintExportModalComponent implements OnInit {
	@ViewChild('printSection') printSection!: ElementRef;
	entityConfig!: MikaEntityConfig;
	isPrinting: boolean = false;
	printData: any[] = [];
	printMode: string = 'page';
	fieldMode: string = 'all';
	selectedPrintFields: string[] = [];
	filterValues: any = {};

	dataSource: any;
	constructor(
		private modalController: ModalController,
		private loading: MikaLoading,
		private cdr: ChangeDetectorRef,
		private api: MikaApiService
	) { }

	ngOnInit() { }


	closePrintModal() {
		this.modalController.dismiss();
	}

	onPrintModalWillDismiss(e: any) {
		this.isPrinting = false;
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

	print2() {
		const host = document.getElementById('print-host');
		if (!host) return;

		// انسخ محتوى الطباعة من المودال
		const originalPrintSection = this.printSection.nativeElement as HTMLElement;
		const cloned = originalPrintSection.cloneNode(true) as HTMLElement;

		// أفرغ المضيف ثم أضف النسخة
		host.innerHTML = cloned.getHTML();
		// host.appendChild(cloned);

		// اجعل المضيف مرئي للطباعة
		host.style.display = 'block';

		// أضف كلاس لتطبيق ستايلات الطباعة
		document.body.classList.add('printing');

		// انتظر تحديث DOM ثم اطبع
		setTimeout(() => {
			window.print();
			host.style.display = 'none';
			document.body.classList.remove('printing');
		}, 500);
	}

	print3() {
		this.isPrinting = true;

		// انتظر Angular يجهز DOM
		setTimeout(() => {
			const printHost = document.getElementById('print-host');
			const printSection = this.printSection.nativeElement;

			if (!printHost || !printSection) return;

			// انسخ المحتوى المراد طباعته
			const cloned = printSection.cloneNode(true) as HTMLElement;

			// ضع المحتوى في print-host
			printHost.innerHTML = cloned.getHTML();
			// printHost.appendChild(cloned);
			printHost.style.display = 'block';

			document.body.classList.add('printing');

			// انتظر تثبيت الـ DOM ثم اطبع
			setTimeout(() => {
				window.print();

				// تنظيف بعد الطباعة
				printHost.style.display = 'none';
				document.body.classList.remove('printing');
			}, 300);
		}, 100);
	}

	async fetchAllResults() {
		const params = { ...this.filterValues };
		if (this.entityConfig.endpoints?.allResults) {
			return await firstValueFrom(this.api.config(this.entityConfig).custom(this.entityConfig.endpoints?.allResults.replace(this.entityConfig.endpoints?.get!, ''), params));
		} else if (this.entityConfig.request?.allResultsParam) {
			params[this.entityConfig.request?.allResultsParam] = true;
			return await firstValueFrom(this.api.config(this.entityConfig).get(params));
		}
		return await firstValueFrom(this.api.config(this.entityConfig).custom('all', params));
	}

	get printableColumns() {
		return this.entityConfig.table?.columns.filter(col =>
			this.fieldMode === 'all' || this.selectedPrintFields.includes(col.key)
		);
	}

	export(e?: any) {

	}

}
