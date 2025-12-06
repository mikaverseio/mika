import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonModal, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { MikaContainerComponent } from "../../../components/ui/mika-container/mika-container.component";
import { RouterModule } from '@angular/router';
import { MikaI18nService } from '../../../services/infra/mika-i18n.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.page.html',
	styleUrls: ['./settings.page.scss'],
	standalone: true,
	imports: [IonIcon, IonButton, IonButtons, IonModal, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MikaContainerComponent, RouterModule, TranslatePipe]
})
export class MikaSettingsPage implements OnInit {

	@ViewChild(IonModal) langMoal!: IonModal;
	languageService = inject(MikaI18nService);
	constructor() {
	}

	ngOnInit() {
	}

	updateDashboardLang(lang: any) {
		this.languageService.setDashboardLanguage(lang);
		this.langMoal.dismiss();
	}

}
