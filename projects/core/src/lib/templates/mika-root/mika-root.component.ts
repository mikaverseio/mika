import { Component, effect, signal, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, ModalController, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonButton, IonButtons, IonFooter, IonChip, IonHeader, IonAvatar, IonToolbar, IonImg, IonLoading, IonAlert } from '@ionic/angular/standalone';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MikaI18nService } from '../../services/infra/mika-i18n.service';
import { MikaAuthService } from '../../services/auth/mika-auth.service';
import { MikaLoading } from '../../services/data/mika-loading.service';
import { MikaEngineService } from '../../services/engine/mika-engine.service';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaTenantSwitcherComponent } from '../../components/switchers/mika-tenant-switcher/mika-tenant-switcher.component';
import { MikaActionService, MikaIconResolverService } from '../../services';
import { MikaHubComponent } from '../../components/mika/mika-hub/mika-hub.component';
import { MikaSidebarService } from '../../services/view/mika-sidebar.service';
import { MikaThemeService } from '../../services/view/mika-theme.service';


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
export class MikaRootComponent implements OnInit, AfterViewInit {

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
		private modalController: ModalController,
		private actions: MikaActionService,
		public sidebar: MikaSidebarService,
		public icons: MikaIconResolverService,
		public theme: MikaThemeService
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

	async ngOnInit() {
		// this.mikaLoading.present();
		// await this.auth.initialize();
		// await this.mika.sidebar.render();
		// this.isInitializing.set(false)
		// this.mikaLoading.dismiss();
		await this.theme.initializeUserPreferances();
	}

	async showTenantSwitcher() {
		const modal = await this.modalController.create({
			// component: MikaTenantSwitcherComponent,
			component: MikaHubComponent
		});

		modal.present();
	}

	async showMikaHub(){
		const modal = await this.modalController.create({
			component: MikaHubComponent,
			cssClass: 'mika-hub-modal'
		});

		modal.present();
	}

	ngAfterViewInit() {
		this.actions.setAlert(this.confirmActionAlert);
	}

	toggleAppearance() {
		this.theme.toggleChange('system')
	}

}
