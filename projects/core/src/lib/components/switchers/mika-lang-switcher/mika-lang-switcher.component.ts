import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Mika } from '../../../helpers/mika-app.helper';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { MikaLanguageService } from '../../../services/mika-language.service';

@Component({
	selector: 'mika-lang-switcher',
	imports: [MatButtonToggleModule],
	template: `
	@if (config?.localizable && Mika.settings.languages && Mika.settings.languages.options && Mika.settings.languages.options.length) {
			@if (Mika.settings.languages.options.length <= 3) {
				<mat-button-toggle-group name="locale" aria-label="Language" style="flex-grow: 0; flex-shrink: 0;" (change)="onLangSwitch($event)">
					@for (lang of Mika.settings.languages.options; track lang.locale) {
						<mat-button-toggle [value]="lang.locale" [checked]="languageService.formLocaleSignal() == lang.locale">{{ lang.title }}</mat-button-toggle>
					}
				</mat-button-toggle-group>
			} @else {
				// TDODO: Implement dropdown for more than 3 languages
			}
		}
  `,
})
export class MikaLangSwitcherComponent implements OnInit {
	@Input() config!: MikaEntityConfig | null;
	@Input() source: 'form' | 'table' = 'table';
	@Output() langSwitched = new EventEmitter<any>();
	Mika = Mika;
	languageService = inject(MikaLanguageService);

	ngOnInit() { }

	onLangSwitch = (e: any) => {
		if ( this.source === 'form' ) {
			this.languageService.formLocaleSignal.set(e.value);
		} else {
			this.languageService.tableLocalSignal.set(e.value);
		}
	}
}
