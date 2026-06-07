import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { firstValueFrom } from 'rxjs';
import { MikaApiService, MikaEntityConfig, MikaDataService, MikaLoading, printHtml } from '@mikaverse/core';
import { LocalizePipe } from '../../../pipes/localize.pipe';
import { GetValuePipe } from '../../../pipes/get-value.pipe';
import { PrintComponent } from '../print/print.component';
import { TableFiltersComponent } from '../table-filters/table-filters.component';

@Component({
  selector: 'app-mika-print-export-modal',
  standalone: true,
  templateUrl: './mika-print-export-modal.component.html',
  styleUrls: ['./mika-print-export-modal.component.scss'],
  imports: [
    CommonModule,
    TranslatePipe,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    PrintComponent,
    TableFiltersComponent,
    LocalizePipe,
    GetValuePipe,
  ],
})
export class MikaPrintExportModalComponent implements OnInit {
  @ViewChild('printSection') printSection!: ElementRef;
  entityConfig!: MikaEntityConfig;
  isPrinting = false;
  printData: any[] = [];
	printMode: string = 'page';
	fieldMode: string = 'all';
	selectedPrintFields: string[] = [];
	filterValues: any = {};
	dataSource: any;
	get selectedColumns() {
		if (this.fieldMode === 'all') return this.entityConfig.table.columns ?? [];
		const allowed = new Set(this.selectedPrintFields);
		return (this.entityConfig.table.columns ?? []).filter(c => allowed.has(c.key));
	}

  private dialogRef = inject(MatDialogRef<MikaPrintExportModalComponent>, { optional: true });
  private loading = inject(MikaLoading);
  private cdr = inject(ChangeDetectorRef);
  private api = inject(MikaApiService);
  private dataService = inject(MikaDataService);

  ngOnInit() {}

  closePrintModal() {
    this.dialogRef?.close();
  }

  togglePrintMode(e: any) {
    this.printMode = e.value;
    if (this.printMode === 'page') {
      this.printData = this.dataSource?.data ?? [];
    } else {
      this.loading.present();
      this.fetchAllResults()
        .then(all => {
          this.printData = all;
          this.loading.dismiss();
          this.cdr.detectChanges();
        })
        .catch(() => this.loading.dismiss());
    }
  }

  toggleFieldMode(e: any) {
    this.fieldMode = e.value;
    if (this.fieldMode === 'custom') {
      this.selectedPrintFields = this.entityConfig.table.columns.map(c => c.key);
    }
  }

  print() {
    if (!this.printSection) return;
    printHtml(this.printSection.nativeElement.innerHTML);
  }

  async fetchAllResults() {
    const params = { ...this.filterValues };
    if (this.entityConfig.endpoints?.allResults) {
      return await firstValueFrom(
        this.api
          .config(this.entityConfig)
          .custom(this.entityConfig.endpoints?.allResults.replace(this.entityConfig.endpoints?.get!, ''), params)
      );
    } else if (this.entityConfig.request?.allResultsParam) {
      params[this.entityConfig.request?.allResultsParam] = true;
      return await firstValueFrom(this.api.config(this.entityConfig).get(params));
    }
    return await firstValueFrom(this.api.config(this.entityConfig).custom('all', params));
  }
}
