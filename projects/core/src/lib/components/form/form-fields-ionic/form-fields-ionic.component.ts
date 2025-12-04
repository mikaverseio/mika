import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonInput, IonItem, IonList, IonLabel, IonTextarea, IonSelect, IonSelectOption, IonAccordion, IonAccordionGroup } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MikaFormContextService } from '../../../services/view/mika-form-context.service';
import { FileUploadComponent } from '../../../fields/file-upload/file-upload.component';


@Component({
	selector: 'app-form-fields-ionic',
	templateUrl: './form-fields-ionic.component.html',
	styleUrls: ['./form-fields-ionic.component.scss'],
	imports: [
		TranslatePipe, QuillModule, ReactiveFormsModule, FormsModule, CommonModule, FileUploadComponent,
		MatDatepickerModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatCheckboxModule, MatSelectModule,
		IonList, IonItem, IonInput, IonSelect, IonAccordion, IonAccordionGroup, IonLabel, IonTextarea, IonSelectOption,
		MatSlideToggleModule, MatButtonModule],

	// viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]
})
export class FormFieldsIonicComponent implements OnInit {

	public context = inject(MikaFormContextService);
	constructor() { }

	ngOnInit() { }

	onEditorCreated(quill: Quill) {
		quill.setSelection(0, 0); // force selection
		quill.format('direction', 'rtl');
		quill.format('align', 'right');
	}

}
