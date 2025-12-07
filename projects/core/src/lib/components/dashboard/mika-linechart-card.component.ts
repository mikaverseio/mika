import { Component, Input, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner,
    IonList, IonItem, IonLabel, IonNote, IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { timeOutline, ellipsisVertical } from 'ionicons/icons';
import { MikaWidgetConfig } from '../../interfaces';

// Assuming data structure for recent items (simplified)
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
        IonSpinner, IonList, IonItem, IonLabel, IonNote, IonIcon
    ],
    template: `

    `
})
export class MikaLineChartCardComponent {

}
