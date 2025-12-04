import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { MikaFormComponent } from '../../../components/form/mika-form/form.component';
import { MikaMetaService } from '../../../services/infra/mika-meta.service';
import { TranslateService } from '@ngx-translate/core';
import { Mika } from '../../../helpers/mika-app.helper';
import { MikaAppService } from '../../../services/engine/mika-app.service';

@Component({
	selector: 'mika-entity-edit',
	template: `<mika-form *ngIf="entityConfig" [config]="entityConfig" [id]="id" mode="edit"></mika-form>`,
	imports: [MikaFormComponent, CommonModule]
})
export class EntityEditPage implements OnInit {

	@ViewChild(MikaFormComponent)
	mikaForm!: MikaFormComponent;

	entityConfig!: MikaEntityConfig;
	id: any;

	private route = inject(ActivatedRoute);
	private app = inject(MikaAppService);
	private seo = inject(MikaMetaService);
	private translate = inject(TranslateService);

	async ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
		const slug = this.route.snapshot.paramMap.get('slug')!;
		this.entityConfig = await this.app.getConfig(slug);
		this.seo.setMetaTags({
			title: `${this.translate.instant(Mika.siteName)} - ${this.translate.instant('form-edit', {slug: this.translate.instant(this.entityConfig.singular ?? 'item')})}`
		});
	}

}
