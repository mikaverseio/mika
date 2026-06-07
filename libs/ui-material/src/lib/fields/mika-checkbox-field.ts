import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'mika-checkbox-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, MatCheckboxModule],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
   <div class="w-100">
   <mat-checkbox [formControlName]="field.key">
		{{ field.label | translate }}
	</mat-checkbox>
   </div>
  `
})
export class MikaCheckboxFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;
}