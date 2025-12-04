import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'mika-toggle-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule, TranslatePipe],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
  	<div class="w-100">
		<mat-slide-toggle [formControlName]="field.key">
			{{ field.label | translate }}
		</mat-slide-toggle>
  	</div>
  `
})
export class MikaToggleFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;
}