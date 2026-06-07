
import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, IonSearchbar, IonList, IonItem, IonButton, IonIcon, IonButtons, IonTitle , ModalController, IonInput, IonChip, IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonItemDivider, IonItemGroup, IonInputPasswordToggle, IonSelect, IonSelectOption, IonPopover } from "@ionic/angular/standalone";
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MikaContextService } from '@mikaverse/core';
import { MikaAuthService } from '@mikaverse/core';
import { MikaLoading } from '@mikaverse/core';
import { MikaAppConfig } from '@mikaverse/core';
import { MikaAiGeneratorComponent } from '../../ai/mika-ai-generator/mika-ai-generator.component';

@Component({
	selector: 'mika-hub',
	templateUrl: './mika-hub.component.html',
	styleUrls: ['./mika-hub.component.scss'],
	imports: [IonLabel, IonChip, IonPopover, IonInput, IonTitle, IonButtons, IonIcon, IonButton, IonItem, IonList, IonSearchbar, IonContent, IonToolbar, IonHeader, TranslatePipe, FormsModule, CommonModule, MatTooltipModule, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, MikaAiGeneratorComponent, IonItemDivider, IonItemGroup, IonInputPasswordToggle, IonSelect, IonSelectOption]
})
export class MikaHubComponent implements OnInit {

  public context = inject(MikaContextService);

	selectedTab = 'tenants';

	tenants = this.context.getAllApps();
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

	async switchTenant(appId: string) {
		this.loading.present();
		await this.auth.setActiveAppId(appId);
		await this.context.activateApp(appId);
		setTimeout(() => {
			this.modalController.dismiss();
			this.loading.dismiss();
			this.router.navigateByUrl('/dashboard');
		}, 300);
	}

	async switchEnv(envId: string) {
		this.loading.present();
		await this.context.setActiveEnvironment(envId);
		setTimeout(() => {
			this.modalController.dismiss();
			this.loading.dismiss();
			this.router.navigateByUrl('/dashboard');
		}, 300);
	}

	toggleLogin(i: number) {
		this.showLogin[i] = !this.showLogin[i];
	}

	async login(email: string, password: string, app: MikaAppConfig) {
		try {
			this.loading.present();
			const response: any = await this.auth.login({email: email, password: password},  app);

			if (response.success) {
				await this.switchTenant(app.appId);
			} else {
				console.warn('email-or-password-incorrect');
			}

		} catch (e) {
			console.error('mf-something-wrong', e);
		} finally {
			this.loading.dismiss();
		}




	}

	async logout(tenant: MikaAppConfig) {
		this.loading.present();
		await this.auth.logout(tenant);
		const remaining = this.auth.getRemainingUsers();
		if (remaining) {
			this.switchTenant(remaining[0]);
		}
		this.loading.dismiss();
	}

}
