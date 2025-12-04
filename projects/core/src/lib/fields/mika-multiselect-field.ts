import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaFieldConfig } from '../interfaces/field/mika-field-config.interface';

@Component({
	selector: 'mika-multiselect-field',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, TranslatePipe],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
	template: `
    <mat-form-field appearance="fill" style="width: 100%; margin-bottom: 16px;">
      <mat-label>{{ field.label | translate }}</mat-label>
      <mat-select [formControlName]="field.key" multiple>
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
export class MikaMultiSelectFieldComponent {
	@Input() field!: MikaFieldConfig;
	@Input() form!: FormGroup;
}
