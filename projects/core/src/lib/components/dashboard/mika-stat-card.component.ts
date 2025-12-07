import { Component, Input, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonNote, IonChip } from '@ionic/angular/standalone';
import { MikaWidgetConfig } from '../../interfaces';
import { MikaContextService } from '../../services';

@Component({
    selector: 'mika-stat-card',
    standalone: true,
    imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonNote, IonChip],
    template: `
        <ion-card class="shadow-md">
            <ion-card-content class="pt-0">
                @if (loading()) {
                    <div class="flex justify-center items-center h-16">
                        <ion-spinner></ion-spinner>
                    </div>
                } @else {
					<div class="flex flex-col aic jsc">
						<ion-note>{{ config.title }}</ion-note>
						<ion-chip>{{ count() | number }}</ion-chip>
						<ion-note class="text-sm text-slate-500 mt-1">Total {{ config.entitySlug }}</ion-note>
					</div>
                }
            </ion-card-content>
        </ion-card>
    `,
	styles: `
		ion-card {
			-background: #f3f3f3;
			box-shadow: none;
			border-radius: 15px;
			border: 1px solid #dcdfea;
		}
	`
})
export class MikaStatCardComponent implements OnInit {
    @Input({ required: true }) config!: MikaWidgetConfig;

	private context = inject(MikaContextService); // Context for system stats

    count = signal(0);
    loading = signal(true);

    async ngOnInit() {
        this.loading.set(true);
        try {
            if (this.config.entitySlug === 'mika_system_apps') {
                // SYSTEM STATS: Get count directly from Context Service
                this.count.set(this.context.appsCount());

            } else if (this.config.entitySlug) {
                // 🛑 ENTITY STATS: Use the Data Facade (MikaDataService)
                // const total = await this.dataService.getEntityCount(this.config.entitySlug);
                this.count.set(0);
            }
        } catch (e) {
            // Error handling remains here
            this.count.set(0);
        } finally {
            this.loading.set(false);
        }
    }
}
