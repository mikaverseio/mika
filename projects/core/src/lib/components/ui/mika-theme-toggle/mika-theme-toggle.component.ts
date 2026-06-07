import { Component, computed, inject, Input, input, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonSelect, IonSelectOption, IonButtons } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaThemeService, ThemeMode } from '../../../services/view/mika-theme.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'mika-theme-toggle',
	templateUrl: './mika-theme-toggle.component.html',
	styleUrls: ['./mika-theme-toggle.component.scss'],
	imports: [IonButtons, IonSelect, IonSelectOption, IonButton, IonIcon, TranslatePipe, MatTooltipModule]
})
export class MikaThemeToggleComponent implements OnInit {

	@Input() renderMode: 'select' | 'button' = 'select';
	theme = inject(MikaThemeService);

	constructor() { }

	ngOnInit() { }

	toggle() {
		const mode = this.theme.activeMode();
		if (mode === 'system') {
			this.theme.toggleChange('dark');
		} else if (mode === 'dark') {
			this.theme.toggleChange('light');
		} else if (mode === 'light') {
			this.theme.toggleChange('system');
		}
	}

	setMode(mode: ThemeMode) {
		this.theme.toggleChange(mode);
	}

}
