import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonFooter, IonTitle, IonToolbar, IonButton } from "@ionic/angular/standalone";
import { TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Mika } from '../../../helpers/mika-app.helper';

@Component({
	selector: 'mika-cannot-find-it',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss'],
	imports: [IonButton, IonToolbar, IonTitle, IonFooter, IonContent,
		IonHeader, TranslatePipe, RouterModule
	]
})
export class NotFoundComponent implements OnInit {
	Mika = Mika;
	constructor() { }

	ngOnInit() { }

}
