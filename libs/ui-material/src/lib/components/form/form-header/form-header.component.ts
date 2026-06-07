import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MikaUiService } from '../../../services/mika-ui.service';
import { MikaFormContextService } from '../../../services/mika-form-context.service';

@Component({
	selector: 'app-form-header',
	templateUrl: './form-header.component.html',
	styleUrls: ['./form-header.component.scss'],
	imports: [
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatButtonToggleModule,
		TranslatePipe
	]
})
export class FormHeaderComponent implements OnInit {

	public context = inject(MikaFormContextService);
	public toast = inject(MikaUiService);

	constructor() {
	}

	ngOnInit() {
	}

}
