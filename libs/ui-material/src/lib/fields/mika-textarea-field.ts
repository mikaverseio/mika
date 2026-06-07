import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'mika-textarea-field',
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
		<textarea matInput [formControlName]="field.key"
			[placeholder]="field.placeholder ?? '' | translate"></textarea>
	</mat-form-field>
  `
})
export class MikaTextareaFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;
}
