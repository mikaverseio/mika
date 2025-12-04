import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { CommonModule } from '@angular/common';

import { MikaSeoService } from '../../../services/mika-seo.service';
import { TranslateService } from '@ngx-translate/core';
import { Mika } from '../../../helpers/mika-app.helper';
import { MikaAppService } from '../../../services/mika-app.service';
import { MikaFormComponent } from '../../../components';

@Component({
	selector: 'app-entity-create',
	standalone: true,
	template: `<mika-form *ngIf="entityConfig" [config]="entityConfig" mode="create"></mika-form>`,
	imports: [MikaFormComponent, CommonModule]
})
export class EntityCreatePage implements OnInit {
	entityConfig!: MikaEntityConfig;

	private route = inject(ActivatedRoute);
	private app = inject(MikaAppService);
	private seo = inject(MikaSeoService);
	private translate = inject(TranslateService);

	async ngOnInit() {
		const slug = this.route.snapshot.paramMap.get('slug')!;
		this.entityConfig = await this.app.getConfig(slug);
		this.seo.setMetaTags({
			title: `${this.translate.instant(Mika.siteName)} - ${this.translate.instant('form-create', {slug: this.translate.instant(this.entityConfig.singular ?? 'item')})}`
		});
	}
}
