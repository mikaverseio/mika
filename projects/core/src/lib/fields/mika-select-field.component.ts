import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'mika-select-field',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		TranslatePipe
	],
	viewProviders: [
		{ provide: ControlContainer, useExisting: FormGroupDirective }
	],
	template: `
		<mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
		<mat-label>{{ field.label | translate }}</mat-label>
		<mat-select [formControlName]="field.key">
			@for (opt of field.options; track opt.value) {
			<mat-option [value]="opt.value">
				@if (opt.isTranslatable) {
				{{ opt.label | translate }}
				} @else {
				{{ opt.label }}
				}
			</mat-option>
			}
		</mat-select>
		</mat-form-field>
  	`
})
export class MikaSelectFieldComponent {
	@Input() field: any;
	@Input() form!: FormGroup;
}
