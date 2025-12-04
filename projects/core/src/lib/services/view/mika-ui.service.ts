import { inject, Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
	providedIn: 'root'
})
export class MikaUiService {

	private _snackBar = inject(MatSnackBar);

	constructor(
		private toastController: ToastController,
		private location: Location,
		private translate: TranslateService
	) { }

	async showToast(message: string, color: string = 'dark') {
		const toast = await this.toastController.create({
			message: this.translate.instant(message),
			duration: 3000,
			position: 'bottom',
			color: color,
			mode: 'ios'
		});
		await toast.present();
	}

	back() {
		this.location.back();
	}

	openSnackBar(message: string, action?: string) {
		this._snackBar.open(this.translate.instant(message), this.translate.instant('OK'), {
			duration: 3000
		});
	}


}
