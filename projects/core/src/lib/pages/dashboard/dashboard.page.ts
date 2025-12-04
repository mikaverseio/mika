import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaEngineService } from '../../services/engine/mika-engine.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
	standalone: true,
	imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslatePipe]
})
export class DashboardPage implements OnInit {

	Mika = Mika;
	mika = inject(MikaEngineService);
	constructor() { }

	ngOnInit() {
	}

}
