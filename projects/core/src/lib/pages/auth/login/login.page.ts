import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { IonButton, IonContent, IonList, IonItem, IonInput, IonLoading, ModalController, NavController, IonSelect, IonSelectOption, IonImg } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaAuthService } from '../../../services/auth/mika-auth.service';
import { MikaUiService } from '../../../services/view/mika-ui.service';
import { ActivatedRoute } from '@angular/router';
import { MikaAppService } from '../../../services/engine/mika-app.service';
import { Mika } from '../../../helpers/mika-app.helper';
import { MikaStorageService } from '../../../services/infra/mika-storage.service';
import { MikaAppConfig } from '../../../interfaces/core/mika-app-config.interface';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
	imports: [IonImg, CommonModule, FormsModule, IonContent, IonList, IonItem, IonInput, IonButton, TranslatePipe, IonLoading, IonSelect, IonSelectOption],
})
export class LoginPage implements OnInit {

  public app = inject(MikaAppService);

	@ViewChild(IonLoading) loading!: IonLoading;

	item: any = {};
	isModal: boolean = false;
	submitted: boolean = false;

	appId: string | null = null;
	activeApp: MikaAppConfig = this.app.getDefaultApp() as MikaAppConfig;

	Mika = Mika;

	constructor(
		private auth: MikaAuthService,
		private toast: MikaUiService,
		private nav: NavController,
		private modalCtrl: ModalController,
		private route: ActivatedRoute,
		private preferences: MikaStorageService
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
					this.toast.showToast('email-or-password-incorrect', 'danger');
				}
			} catch (error) {
				this.loading.dismiss();
				this.toast.showToast('mf-something-wrong', 'danger');
			}
		} else {
			this.toast.showToast('mf-fields-required', 'warning');
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
