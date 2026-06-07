import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MikaEntityConfig, MikaMetaService } from '@mikaverse/core';
import { MikaTableComponent } from '../../../components/table/mika-table/table.component';
import { TranslateService } from '@ngx-translate/core';
import { MikaContextService } from '@mikaverse/core';
import { MikaNotFoundComponent } from '../../../components/not-found/not-found.component';
import { Platform } from '@ionic/angular/standalone';
import { MikaTableMobileComponent } from "../../../components/table/mika-table-mobile/mika-table-mobile.component";
import { MikaConfigService } from '@mikaverse/core';
@Component({
	selector: 'mika-entity-list',
	template: `
		<ng-container *ngIf="entityConfig as config; else notFound">
			@if (platform.is('android') || platform.is('ios')) {
				<mika-table-mobile [entityConfig]="config"></mika-table-mobile>
			} @else {
				<mika-table [entityConfig]="config"></mika-table>
			}

		</ng-container>
		<ng-template #notFound>
			<mika-cannot-find-it></mika-cannot-find-it>
		</ng-template>
	`,
	imports: [MikaTableComponent, CommonModule, MikaNotFoundComponent, MikaTableMobileComponent]
})
export class MikaEntityListPage implements OnInit {

	entityConfig!: MikaEntityConfig | null;

	private route = inject(ActivatedRoute);
	private config = inject(MikaConfigService);
	private seo = inject(MikaMetaService);
	private translate = inject(TranslateService);
	public platform = inject(Platform)

	async ngOnInit() {
		this.route.paramMap.subscribe(async params => {
			const slug = params.get('slug')!;

			this.entityConfig = await this.config.getConfig(slug);
			if (!this.entityConfig) return;

			this.seo.setMetaTags({
				title: `${this.translate.instant('Mika')} - ${this.translate.instant(this.entityConfig?.contentType!)}`
			});
		});
	}

}


// <mika-table-mobile *ngIf="isNative" [items]="dataSource.data" [visibleColumns]="visibleColumnKeys" [entityConfig]="entityConfig"></mika-table-mobile>
