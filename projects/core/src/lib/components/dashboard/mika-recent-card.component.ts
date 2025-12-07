import { Component, Input, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner,
    IonList, IonItem, IonLabel, IonNote, IonIcon,
	IonSelect,
	IonSelectOption
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { timeOutline, ellipsisVertical } from 'ionicons/icons';
import { MikaWidgetConfig } from '../../interfaces';
import { MikaDataService } from '../../services';
import { TranslatePipe } from '@ngx-translate/core';

interface RecentItem {
    id: string;
    title: string;
    status: string;
    date: string;
}

@Component({
    selector: 'mika-recent-card',
    standalone: true,
    imports: [
        CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
        IonSpinner, IonList, IonItem, IonLabel, IonNote, IonIcon, IonSelect,
		IonSelectOption, TranslatePipe
    ],
    template: `
        <ion-card class="shadow-md">
            <ion-card-content class="pt-0">
				<div class="flex jcb aic">
					<ion-note><strong>{{ config.title | translate }}</strong></ion-note>
					<ion-select interface="popover">

						<ion-select-option [value]>12123</ion-select-option>
					</ion-select>
				</div>
                @if (loading()) {
                    <div class="flex justify-center items-center h-24">
                        <ion-spinner></ion-spinner>
                    </div>
                } @else if (items().length === 0) {
                    <div class="text-center py-6 text-slate-500">
                        No recent activity found for {{ config.entitySlug }}.
                    </div>
                } @else {
                    <ion-list lines="none" class="bg-white">
                        @for (item of items(); track item.id) {
                            <ion-item button detail class="hover:bg-slate-50 transition-colors">
                                <ion-icon name="time-outline" slot="start" class="text-indigo-400"></ion-icon>
                                <ion-label>
                                    <div class="font-medium text-slate-800">{{ item.title }}</div>
                                    <ion-note class="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                        <ion-icon name="time-outline"></ion-icon>
                                        <span>{{ item.date }}</span>
                                        <span class="text-xs font-semibold text-{{getStatusColor(item.status)}}">
                                            {{ item.status | titlecase }}
                                        </span>
                                    </ion-note>
                                </ion-label>
                                <ion-icon name="ellipsis-vertical" slot="end" class="text-slate-400"></ion-icon>
                            </ion-item>
                        }
                    </ion-list>
                    <div class="text-right pt-2">
                        <a href="/{{ config.entitySlug }}" class="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">View All &rarr;</a>
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
export class MikaRecentCardComponent implements OnInit {
    @Input({ required: true }) config!: MikaWidgetConfig;

    private dataService = inject(MikaDataService);

    items = signal<RecentItem[]>([]);
    loading = signal(true);

    constructor() {
        addIcons({ timeOutline, ellipsisVertical });
    }

    async ngOnInit() {
        this.loading.set(true);
        try {
           await this.dataService.getRecent('posts');
			this.items.set([]);
        } catch (e) {
            console.error('Failed to load recent list:', e);
            this.items.set([]);
        } finally {
            this.loading.set(false);
        }
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'published': return 'green-600';
            case 'draft': return 'amber-600';
            case 'shipped': return 'indigo-600';
            default: return 'slate-500';
        }
    }
}
