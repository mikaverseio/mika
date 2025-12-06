import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { CommonModule } from '@angular/common';

import { MikaMetaService } from '../../../services/infra/mika-meta.service';
import { TranslateService } from '@ngx-translate/core';
import { Mika } from '../../../helpers/mika-app.helper';
import { MikaFormComponent } from '../../../components';
import { MikaConfigService } from '../../../services';

@Component({
	selector: 'app-entity-create',
	standalone: true,
	template: `<mika-form *ngIf="entityConfig" [config]="entityConfig" mode="create"></mika-form>`,
	imports: [MikaFormComponent, CommonModule]
})
export class MikaEntityCreatePage implements OnInit {
	entityConfig!: MikaEntityConfig | null;

	private route = inject(ActivatedRoute);
	private config = inject(MikaConfigService);
	private seo = inject(MikaMetaService);
	private translate = inject(TranslateService);

	async ngOnInit() {
		const slug = this.route.snapshot.paramMap.get('slug')!;

		this.entityConfig = await this.config.getConfig(slug);
		if (!this.entityConfig) return;

		this.seo.setMetaTags({
			title: `${this.translate.instant(Mika.siteName)} - ${this.translate.instant('form-create', {slug: this.translate.instant(this.entityConfig?.singular ?? 'item')})}`
		});
	}
}
