import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MikaFormContextService } from '../../../services/view/mika-form-context.service';

@Component({
	selector: 'app-form-tabbed-components',
	templateUrl: './form-tabbed-components.component.html',
	styleUrls: ['./form-tabbed-components.component.scss'],
	imports: [CommonModule, FormsModule]
})
export class FormTabbedComponentsComponent implements OnInit {

	public context = inject(MikaFormContextService);
	constructor() { }

	ngOnInit() {
	}

}
