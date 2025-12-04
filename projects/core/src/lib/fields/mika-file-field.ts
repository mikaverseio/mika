import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
	selector: 'mika-file-field',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule, FileUploadComponent],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
	template: `
		<div style="margin-bottom: 16px;">
			<app-file-upload [label]="field.label" [accept]="field.accept || '*'"
				[formControlName]="field.key"></app-file-upload>
		</div>
  	`
})
export class MikaFileFieldComponent {
	@Input() field: any;
	@Input() form!: FormGroup;
}
