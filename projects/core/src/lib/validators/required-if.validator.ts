import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredIf(otherFieldKey: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!control?.parent) return null;

		const otherControl = control.parent.get(otherFieldKey);
		if (!otherControl) return null;

		const otherValue = otherControl.value;

		if (otherValue !== null && otherValue !== undefined && otherValue !== '') {
			const value = control.value;
			const isEmpty = value === null || value === undefined || value === '';
			return isEmpty ? { requiredIf: true } : null;
		}

		return null;
	};
}
