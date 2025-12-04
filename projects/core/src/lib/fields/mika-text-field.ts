import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FormField } from '../interfaces/field/form-field.interface';

@Component({
	selector: 'mika-text-field',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		TranslatePipe
	],
	viewProviders: [
		{ provide: ControlContainer, useExisting: FormGroupDirective }
	],
	template: `
		<mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
			<mat-label>{{ field.label | translate }}</mat-label>
			<input matInput [type]="field.type" [formControlName]="field.key"
				[placeholder]="field.placeholder ?? '' | translate">
		</mat-form-field>
	`
})
export class MikaTextFieldComponent {
	@Input() field!: FormField;
	@Input() form!: FormGroup;
}
