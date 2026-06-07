import { inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
	providedIn: 'root'
})
export class MikaUiService {

	private _snackBar = inject(MatSnackBar);

	constructor(
		private location: Location,
		private translate: TranslateService
	) { }

	async showToast(message: string, color: string = 'dark') {
		this._snackBar.open(this.translate.instant(message), undefined, {
			duration: 3000,
			horizontalPosition: 'right',
			verticalPosition: 'bottom',
			panelClass: color === 'danger' ? ['snack-error'] : ['snack-info']
		});
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
