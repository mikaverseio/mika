import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/general/app.service';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonInput, IonFooter, IonLoading } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaAuthService } from '../../../services/auth/mika-auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
	imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, IonFooter, TranslatePipe, IonLoading],
})
export class ChangePasswordPage implements OnInit {

	@ViewChild(IonLoading) loading!: IonLoading;

	item: any = {};

	constructor(
		private auth: MikaAuthService,
		private toast: ToastService,
		private router: Router
	) { }

	ngOnInit() { }

	async submit(form: any) {
		if (form.valid && this.item.newPassword == this.item.reNewPassword) {
			await this.loading.present();
			this.auth.changePassword(this.item).subscribe({
				next: (res: any) => {
					this.loading.dismiss();
					if (res.success) {
						this.toast.showToast('password-changed successfully');
						this.router.navigateByUrl('/dashboard');
					} else {
						this.toast.showToast('verify-password', 'danger');
					}
				}, error: () => {
					this.loading.dismiss();
					this.toast.showToast('mf-something-wrong', 'danger');
				},
			});
		} else {
			this.toast.showToast('mf-fields-required', 'warning');
		}
	}
}
