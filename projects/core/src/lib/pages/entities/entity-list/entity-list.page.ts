import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { MikaTableComponent } from '../../../components/table/mika-table/table.component';
import { MikaSeoService } from '../../../services/mika-seo.service';
import { Mika } from '../../../helpers/mika-app.helper';
import { TranslateService } from '@ngx-translate/core';
import { MikaAppService } from '../../../services/mika-app.service';
import { NotFoundComponent } from '../../../components/pages/not-found/not-found.component';
import { Platform } from '@ionic/angular/standalone';
import { MikaTableMobileComponent } from "../../../components/table/mika-table-mobile/mika-table-mobile.component";
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
	imports: [MikaTableComponent, CommonModule, NotFoundComponent, MikaTableMobileComponent]
})
export class EntityListPage implements OnInit {

	entityConfig!: MikaEntityConfig;

	private route = inject(ActivatedRoute);
	private app = inject(MikaAppService);
	private seo = inject(MikaSeoService);
	private translate = inject(TranslateService);
	public platform = inject(Platform)

	async ngOnInit() {
		this.route.paramMap.subscribe(async params => {
			const slug = params.get('slug')!;
			this.entityConfig = await this.app.getConfig(slug);
			this.seo.setMetaTags({
				title: `${this.translate.instant(Mika.siteName)} - ${this.translate.instant(this.entityConfig.contentType)}`
			});
		});
	}

}


// <mika-table-mobile *ngIf="isNative" [items]="dataSource.data" [visibleColumns]="visibleColumnKeys" [entityConfig]="entityConfig"></mika-table-mobile>
