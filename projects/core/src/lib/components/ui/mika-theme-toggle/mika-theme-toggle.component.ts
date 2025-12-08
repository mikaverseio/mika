import { Component, inject, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonSelect, IonSelectOption, IonButtons } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaThemeService, ThemeMode } from '../../../services/view/mika-theme.service';

@Component({
	selector: 'mika-theme-toggle',
	templateUrl: './mika-theme-toggle.component.html',
	styleUrls: ['./mika-theme-toggle.component.scss'],
	imports: [IonButtons, IonSelect, IonSelectOption, IonButton, IonIcon, TranslatePipe]
})
export class MikaThemeToggleComponent implements OnInit {

	renderMode: 'select' | 'button' = 'select';
	theme = inject(MikaThemeService);

	constructor() { }

	ngOnInit() { }

	toggle() {

	}

	setMode(mode: ThemeMode) {
		this.theme.toggleChange(mode);
	}

}
