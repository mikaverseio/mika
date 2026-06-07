import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MikaUiService } from '@mikaverse/ui-material';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonInput, IonFooter, IonLoading } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaAuthService } from '@mikaverse/core';

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
		private toast: MikaUiService,
		private router: Router
	) { }

	ngOnInit() { }

	async submit(form: any) {
		if (form.valid && this.item.newPassword == this.item.reNewPassword) {
			console.log('change password stub', this.item);
			this.router.navigateByUrl('/dashboard');
		} else {
			console.warn('mf-fields-required');
		}
	}
}
