import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonModal, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { MikaContainerComponent } from "../../../components/ui/mika-container/mika-container.component";
import { RouterModule } from '@angular/router';
import { MikaLanguageService } from '../../../services/mika-language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircle } from 'ionicons/icons';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.page.html',
	styleUrls: ['./settings.page.scss'],
	standalone: true,
	imports: [IonIcon, IonButton, IonButtons, IonModal, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MikaContainerComponent, RouterModule, TranslatePipe]
})
export class SettingsPage implements OnInit {

	@ViewChild(IonModal) langMoal!: IonModal;
	languageService = inject(MikaLanguageService);
	constructor() {
		addIcons({closeCircle});
	}
	ngOnInit() {
	}

	updateDashboardLang(lang: any) {
		this.languageService.setDashboardLanguage(lang);
		this.langMoal.dismiss();
	}

}
