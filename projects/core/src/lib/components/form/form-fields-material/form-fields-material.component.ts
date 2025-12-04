import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MikaFormContextService } from '../../../services/view/mika-form-context.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MikaFieldsComponent } from '../../../fields/mika-fields';
import { fieldTypeMap } from '../../../fields/field-type-map';
import { Mika } from '../../../helpers/mika-app.helper';
import { MikaLangSwitcherComponent } from '../../switchers/mika-lang-switcher/mika-lang-switcher.component';


@Component({
	selector: 'app-form-fields-material',
	templateUrl: './form-fields-material.component.html',
	styleUrls: ['./form-fields-material.component.scss'],
	imports: [TranslatePipe, ReactiveFormsModule, FormsModule, CommonModule, MatExpansionModule, MatButtonModule, MatSlideToggleModule, MikaFieldsComponent, MatButtonToggleModule, MikaLangSwitcherComponent, TranslateDirective],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective
		}
	]
})
export class FormFieldsMaterialComponent implements OnInit {
	fieldTypeMap = fieldTypeMap;
	step = signal(1);
	expandAll = signal(false);
	public context = inject(MikaFormContextService);
	Mika = Mika;
	constructor() { }

	ngOnInit() { }

	handleExpand(e: any) {
		this.expandAll.set(e.checked);
		if (!this.expandAll()) {
			this.setStep(1);
		}
	}

	setStep(index: number) {
		this.step.set(index);
	}

	nextStep() {
		this.step.update(i => i + 1);
	}

	prevStep() {
		this.step.update(i => i - 1);
	}

}
