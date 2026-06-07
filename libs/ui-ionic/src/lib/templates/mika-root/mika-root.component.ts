import { Component, effect, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, ModalController, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonButton, IonButtons, IonFooter, IonChip, IonHeader, IonAvatar, IonToolbar, IonImg, IonLoading, IonAlert } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MikaI18nService, MikaAuthService, MikaLoading, MikaEngineService, MikaActionService } from '@mikaverse/core';
import { Mika } from '@mikaverse/core';
import { MikaIconResolverService } from '../../services';
import { MikaSidebarService } from '../../services/view/mika-sidebar.service';


@Component({
  standalone: true,
	selector: 'mika-root',
	templateUrl: './mika-root.component.html',
	styleUrls: ['./mika-root.component.scss', '../../styles/styles.scss'],
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
export class MikaRootComponent {

	@ViewChild('confirmActionAlert') confirmActionAlert!: IonAlert;
	@ViewChild('globalLoader', { static: false }) globalLoader!: IonLoading;
	Mika = Mika;

	isInitializing = signal(true);
	private isLoading: any;

	constructor(
		public languageService: MikaI18nService,
		public auth: MikaAuthService,
		public mikaLoading: MikaLoading,
		public translate: TranslateService,
		public mika: MikaEngineService,
		public sidebar: MikaSidebarService,
		public icons: MikaIconResolverService,
		private actions: MikaActionService,
		private modalController: ModalController,
	) {

		// this.icons.registerConfigIcons();

		this.isLoading = this.mikaLoading.isLoading;
		effect(() => {
			if (this.isLoading()) {
				this.globalLoader?.present();
			} else {
				this.globalLoader?.dismiss();
			}
		});
	}

}
