import { Component, Input, signal, OnInit, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonNote, IonChip, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { MikaWidgetConfig } from '../../interfaces';
import { MikaContextService } from '../../services';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'mika-stat-card',
    standalone: true,
    imports: [CommonModule, IonCard, IonIcon, IonCardContent, IonSpinner, IonNote, IonChip, TranslatePipe,  TranslateModule, IonBadge],
    template: `
        <ion-card class="shadow-md">
            <ion-card-content class="pt-0">
                @if (loading()) {
                    <div class="flex aic jcs">
                        <ion-spinner></ion-spinner>
                    </div>
                } @else {
					<div class="flex flex-s aic jcb">
						<div class="flex flex-col">
							@if (config.icon) {
								<ion-icon [name]="config.icon"></ion-icon>
							}
							<ion-note><strong>{{ config.title | translate }}</strong></ion-note>
							@if (config.subTitle) {
								<ion-note>{{ config.subTitle! | translate}}</ion-note>
							}
						</div>

						<ion-chip color="secondary">{{ data() }}</ion-chip>
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
		ion-chip {
			font-size: 1.2rem;
    		font-weight: 700;
		}
		ion-icon {
			font-size: 22px;
    		margin-bottom: 10px;
		}
	`
})
export class MikaStatCardComponent implements OnInit {
    @Input({ required: true }) config!: MikaWidgetConfig;

	private context = inject(MikaContextService); // Context for system stats
	private componentInjector = inject(Injector);

    data = signal<any>(null);
    loading = signal(true);

    async ngOnInit() {
        this.loading.set(true);
        try {
			if (this.config.dataSourceFn) {
				const data = await this.config.dataSourceFn();
				this.data.set(data);
			}


        } catch (e) {
            // Error handling remains here
            this.data.set(0);
        } finally {
            this.loading.set(false);
        }
    }
}
