import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MikaDateFieldComponent } from './mika-date-field';
import { MikaTimeFieldComponent } from './mika-time-field';

@Component({
	selector: 'mika-datetime-field',
	standalone: true,
	imports: [MikaDateFieldComponent, MikaTimeFieldComponent],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
	template: `
		<mika-date-field [field]="field"/>
		<mika-time-field [field]="field"/>
  	`
})
export class MikaDateTimeFieldComponent {
	@Input() field: any;
	@Input() form!: FormGroup;
}