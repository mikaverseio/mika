import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MikaEntityConfig } from '@mikaverse/core/schema';
import { MikaFormComponent } from '../../../components/form/mika-form/form.component';
import { MikaConfigService } from '@mikaverse/core';

@Component({
	selector: 'mika-entity-view',
	template: `<mika-form *ngIf="entityConfig" [config]="entityConfig" [id]="id" mode="view"></mika-form>`,
	imports: [MikaFormComponent, CommonModule]
})
export class MikaEntityViewPage implements OnInit {

	entityConfig!: MikaEntityConfig | null;
	id: number = 0;

	private route = inject(ActivatedRoute);
	private config = inject(MikaConfigService);

	async ngOnInit() {
		this.id = Number(this.route.snapshot.paramMap.get('id'));
		const slug = this.route.snapshot.paramMap.get('slug')!;
		this.entityConfig = await this.config.getConfig(slug);
		if (!this.entityConfig) return;
	}

}
