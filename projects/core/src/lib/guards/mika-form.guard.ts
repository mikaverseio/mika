import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { EntityEditPage } from '../pages/entities/entity-edit/entity-edit.page';
import { TranslateService } from '@ngx-translate/core';

export const mikaFormGuard: CanDeactivateFn<EntityEditPage> = async (page: EntityEditPage) => {
	const alertCtrl = inject(AlertController);
	const translate = inject(TranslateService);
	const form = page?.mikaForm;

	if (!form || !form.form || !form.form.dirty) return true;

	const formCfg = {
		confirmLeave: true,
		autoSaveOnLeave: false,
		...(form.config.form.config ?? {})
	};

	if (formCfg.autoSaveOnLeave && form.onSubmit) {
		try {
			console.log('Auto-saving form on leave...');
			await form.onSubmit();
			return true;
		} catch {
			return false;
		}
	}

	if (!formCfg.confirmLeave) return true;

	const alert = await alertCtrl.create({
		header: translate.instant('Confirm Leave'),
		message: translate.instant(formCfg.confirmLeaveMessage ?? 'mf-leave-confirmation'),
		buttons: [
			{ text: translate.instant('Cancel'), role: 'cancel' },
			{ text: translate.instant('Leave'), role: 'confirm' }
		]
	});

	await alert.present();
	const result = await alert.onDidDismiss();
	return result.role === 'confirm';
};
