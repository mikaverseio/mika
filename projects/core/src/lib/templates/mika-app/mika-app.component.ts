import { Component, effect, signal, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, ModalController, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonButton, IonButtons, IonFooter, IonChip, IonHeader, IonAvatar, IonToolbar, IonImg, IonLoading, IonAlert } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { images, newspaper, documents, people, cash, calendarNumber, car, addCircle, speedometer, notifications, mail, home, open, logOut, cashSharp, peopleSharp, documentSharp, calendar, peopleCircle, alertCircle, grid, list, book, accessibility, pricetag, pricetags, settings, settingsOutline, help, options, swapHorizontalOutline, rocket, logInOutline, logOutOutline, gridOutline, cashOutline, peopleOutline, calendarNumberOutline, peopleCircleOutline, calendarOutline, alertCircleOutline, listOutline, bookOutline, accessibilityOutline, pricetagsOutline, imagesOutline, newspaperOutline, cubeOutline } from 'ionicons/icons';
import { MikaSelectFieldComponent } from '../../fields/mika-select-field.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MikaLanguageService } from '../../services/mika-language.service';
import { MikaAuthService } from '../../services/auth/mika-auth.service';
import { MikaLoading } from '../../services/mika-loading.service';
import { MikaFormService } from '../../services/mika-form.service';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaActionService } from '../../services/mika-action.service';
import { MikaTenantSwitcherComponent } from '../../components/switchers/mika-tenant-switcher/mika-tenant-switcher.component';


@Component({
  standalone: true,
	selector: 'mika-app',
	templateUrl: './mika-app.component.html',
	styleUrls: ['./mika-app.component.scss', '../../styles/styles.scss'],
	imports: [IonAlert,
		IonLoading, IonToolbar, RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonMenuToggle,
		IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, IonButton, IonButtons, IonFooter, IonChip, IonHeader, TranslatePipe, IonAvatar, IonImg,
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		TranslatePipe,
	]
})
export class MikaAppComponent implements OnInit, AfterViewInit {

	@ViewChild('confirmActionAlert') confirmActionAlert!: IonAlert;
	@ViewChild('globalLoader', { static: false }) globalLoader!: IonLoading;
	Mika = Mika;

	isInitializing = signal(true);
	private isLoading: any;

	constructor(
		public languageService: MikaLanguageService,
		public auth: MikaAuthService,
		public mikaLoading: MikaLoading,
		public translate: TranslateService,
		public mika: MikaFormService,
		private modalController: ModalController,
		private actions: MikaActionService
	) {
		addIcons({
			grid, gridOutline, swapHorizontalOutline, list, book, accessibility, pricetags, images, newspaper, documents, people, cash, cashOutline,
			calendarNumber, calendar, alertCircle, peopleCircle, car, addCircle, speedometer, notifications, mail, home, open, logOut, cashSharp, peopleSharp,
			documentSharp, settings, settingsOutline, help, rocket, logInOutline, logOutOutline, peopleOutline, calendarNumberOutline, peopleCircleOutline,
			calendarOutline, alertCircleOutline, listOutline, bookOutline, accessibilityOutline, pricetagsOutline, imagesOutline, newspaperOutline, cubeOutline
		});

		this.isLoading = this.mikaLoading.isLoading;
		effect(() => {
			if (this.isLoading()) {
				this.globalLoader?.present();
			} else {
				this.globalLoader?.dismiss();
			}
		});
	}

	async ngOnInit() {
		// this.mikaLoading.present();
		// await this.auth.initialize();
		// await this.mika.sidebar.render();
		// this.isInitializing.set(false)
		// this.mikaLoading.dismiss();
	}

	async showTenantSwitcher() {
		const modal = await this.modalController.create({
			component: MikaTenantSwitcherComponent
		});

		modal.present();
	}

	ngAfterViewInit() {
		this.actions.setAlert(this.confirmActionAlert);
	}

}
