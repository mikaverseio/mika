import { Component, inject, OnInit, signal } from '@angular/core';
import { IonButton, IonToolbar, IonButtons, IonBackButton, IonTitle, IonIcon, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastService } from '../../../services/general/app.service';
import { MikaFormContextService } from '../../../services/form/mika-form-context.service';

@Component({
	selector: 'app-form-header',
	templateUrl: './form-header.component.html',
	styleUrls: ['./form-header.component.scss'],
	imports: [IonButton, IonToolbar, IonButtons, IonBackButton, IonTitle, IonIcon, IonSegment, IonSegmentButton, TranslatePipe]
})
export class FormHeaderComponent implements OnInit {

	public context = inject(MikaFormContextService);
	public toast = inject(ToastService);

	constructor() { }

	ngOnInit() {
	}

}
