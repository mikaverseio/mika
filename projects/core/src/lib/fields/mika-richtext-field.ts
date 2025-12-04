import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'mika-richtext-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
	QuillModule
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  template: `
	<div style="margin-bottom: 16px;">
		<label style="display: block; margin-bottom: 8px;">{{ field.label | translate }}</label>
		<quill-editor [formControlName]="field.key" theme="snow"
			placeholder="اكتب هنا"></quill-editor>
	</div>
  `
})
export class MikaRichTextFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;
}
