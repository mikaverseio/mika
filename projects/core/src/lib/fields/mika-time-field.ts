import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
	selector: 'mika-time-field',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, TranslatePipe, MatTimepickerModule],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
	template: `
   <mat-form-field style="width: 100%;">
		<mat-label>{{ field.label | translate }}</mat-label>
		<input matInput
			[matTimepicker]="timepicker"
			[formControlName]="field.key">
		<mat-timepicker #timepicker/>
		<mat-timepicker-toggle [for]="timepicker" matSuffix/>
	</mat-form-field>
  `
})
export class MikaTimeFieldComponent {
	@Input() field: any;
	@Input() form!: FormGroup;
}