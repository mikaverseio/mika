import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonSearchbar, IonList, IonItem, IonButton, IonIcon, IonButtons, IonTitle , ModalController, IonInput, IonChip, IonLabel } from "@ionic/angular/standalone";
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MikaContextService } from '@mikaverse/core';
import { MikaAuthService } from '@mikaverse/core';
import { MikaLoading } from '@mikaverse/core';
import { MikaAppConfig } from '@mikaverse/core';

@Component({
	selector: 'app-mika-tenant-switcher',
	templateUrl: './mika-tenant-switcher.component.html',
	styleUrls: ['./mika-tenant-switcher.component.scss'],
	imports: [IonLabel, IonChip, IonInput, IonTitle, IonButtons, IonIcon, IonButton, IonItem, IonList, IonSearchbar, IonContent, IonToolbar, IonHeader, TranslatePipe, FormsModule, CommonModule, MatTooltipModule]
})
export class MikaTenantSwitcherComponent implements OnInit {

  public app = inject(MikaContextService);

	tenants = this.app.getAllApps();
	email: any;
	password: any;
	showLogin: any = {};
	constructor(
		public modalController: ModalController,
		public auth: MikaAuthService,
		public router: Router,
		private loading: MikaLoading,
	) { }

	ngOnInit() {

	}

	close() {
		this.modalController.dismiss();
	}

	switchTenant(app: MikaAppConfig) {
		this.loading.present();
		this.auth.setActiveAppId(app.appId);
		this.app.activateApp(app.appId);
		setTimeout(() => {
			this.modalController.dismiss();
			this.loading.dismiss();
			this.router.navigateByUrl('/dashboard');
		}, 300);
	}

	toggleLogin(i: number) {
		this.showLogin[i] = !this.showLogin[i];
	}

	login(email: string, password: string, app: MikaAppConfig) {
		this.loading.present();
		this.auth.login({email, password}, app).then(() => {
			this.switchTenant(app);
		}).catch((err) => {
			this.loading.dismiss();
			console.error(err);
		});
	}

	async logout(tenant: MikaAppConfig) {
		this.loading.present();
		const remainingTenants = await this.auth.logout(tenant);
		// if (remainingTenants) {
		// 	this.switchTenant(this.app.getActiveApp()!);
		// }
		this.loading.dismiss();
	}

}
