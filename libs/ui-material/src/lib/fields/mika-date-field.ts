import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'mika-date-field',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, TranslatePipe],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
	template: `
    <mat-form-field appearance="fill" style="width: 100%;">
		<mat-label>{{ field.label | translate }}</mat-label>
		<input matInput [matDatepicker]="picker" [formControlName]="field.key" [min]="field.min" />
		<mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
		<mat-datepicker #picker></mat-datepicker>
	</mat-form-field>
  `
})
export class MikaDateFieldComponent {
	@Input() field: any;
	@Input() form!: FormGroup;
}