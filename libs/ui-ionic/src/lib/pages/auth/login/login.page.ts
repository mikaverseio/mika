import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { IonButton, IonContent, IonList, IonItem, IonInput, IonLoading, ModalController, NavController, IonSelect, IonSelectOption, IonImg, IonInputPasswordToggle, IonNote } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaAuthService, MikaContextService, MikaAppConfig } from '@mikaverse/core';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
	imports: [IonNote, IonImg, CommonModule, FormsModule, IonContent, IonList, IonItem, IonInput, IonButton, TranslatePipe, IonLoading, IonSelect, IonSelectOption, IonInputPasswordToggle, IonNote],
})
export class MikaLoginPage implements OnInit {

  public app = inject(MikaContextService);

	@ViewChild(IonLoading) loading!: IonLoading;

	item: any = {};
	isModal: boolean = false;
	submitted: boolean = false;

	appId: string | null = null;
	activeApp: MikaAppConfig = this.app.getDefaultApp() as MikaAppConfig;

	constructor(
		private auth: MikaAuthService,
		private nav: NavController,
		private modalCtrl: ModalController,
		private route: ActivatedRoute,
	) { }

	async ngOnInit() {
		this.appId = this.route.snapshot.paramMap.get('appId');
		if (this.appId) {
			this.activeApp = this.app.getApp(this.appId) as MikaAppConfig;
		}

		this.item.tenant = this.activeApp.appId;
	}

	async submit(form: any) {
		this.submitted = true;
		if (form.valid) {

			try {
				await this.loading.present();
				const response: any = await this.auth.login({email: this.item.email, password: this.item.password},  this.activeApp!);

				this.loading.dismiss();

				if (response.success) {
					this.nav.navigateRoot('/dashboard');
				} else {
					this.item.password = null;
					console.warn('email-or-password-incorrect');
				}
			} catch (error) {
				this.loading.dismiss();
				console.error(error);
			}
		} else {
			console.warn('mf-fields-required');
		}
	}

	close() {
		if (this.isModal) {
			this.modalCtrl.dismiss();
		}
	}

	onTenantChange(e: any) {
		const selectedTenentId = e.detail?.value;
		if (selectedTenentId) {
			this.activeApp = this.app.getApp(selectedTenentId) as MikaAppConfig;
		}
	}
}
