import { effect, inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { MikaDataService } from '../mika-data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormField } from '../../interfaces/field/form-field.interface';
import { slugify } from '../../utils/utils';
import { MikaPreloadService } from '../mika-preload.service';
import { MikaLanguageService } from '../mika-language.service';

@Injectable({ providedIn: 'root' })
export class MikaFormBuilderService {
	private filterChange$ = new Subject<any>();
	private dataService = inject(MikaDataService);
	private preloadService = inject(MikaPreloadService);

	private injector = inject(Injector);
	languageService = inject(MikaLanguageService);
	selectedLocale = this.languageService.formLocaleSignal;

	constructor() { }

	initForm(fields: FormField[], mode: string, localizable: boolean = false): FormGroup {
		const group: Record<string, FormControl> = {};
		for (const field of fields) {
			if (field.type == 'file' && mode == 'edit') {
				group[field.key] = new FormControl(field.defaultValue ?? null);
			} else {
				group[field.key] = new FormControl(field.defaultValue ?? null, field.validators ?? []);
			}
		}
		if (localizable) {
			group['formTranslations'] = new FormControl([]);
		}
		return new FormGroup(group);
	}

	get filterChanges$() {
		return this.filterChange$.asObservable();
	}

	emitFilterChange(form: FormGroup) {
		this.filterChange$.next(form.getRawValue());
	}

	async enhanceFields(form: FormGroup, fields: FormField[], mode: string, subscribeToChanges: boolean = false) {
		for (const field of fields) {
			const control = form.get(field.key);
			this.initValidators(form, field, control, mode);
			this.initEvents(form, field, control, subscribeToChanges);
			this.initOptionsFromSource(field, control);
			this.handleSlugs(form, field, control);
			if (field.dependsOn && field.filterByParent && field.optionsSource) {
				this.filterByParentField(form, field, control);
			} else if (field.dependsOn && field.loadOptions) {
				await this.loadOptionsBasedOnParent(form, field, control);
			} else if (field.loadOptions && !field.dependsOn) {
				field.options = await field.loadOptions();
			}
		}
	}

	handleSlugs(form: FormGroup, field: FormField, control: any) {
		if (field.type === 'slug' && field.slugSource) {
			const source = form.get(field.slugSource);
			const target = form.get(field.key);

			let userTouched = false;

			if (target && source) {
				target.valueChanges.subscribe(() => {
					userTouched = true;
				});

				source.valueChanges.subscribe((val: string) => {
					// if (!userTouched && val) {
					const slug = slugify(val);
					target.setValue(slug, { emitEvent: false });
					// }
				});
			}
		}
	}

	initEvents(form: FormGroup, field: FormField, control: any, subscribeToChanges: boolean) {
		if (subscribeToChanges && field.type !== 'autocomplete') {
			control.valueChanges.subscribe(() => {
				field.onChange?.(form);
				this.emitFilterChange(form);
			});
		} else if (field.onChange && control) {
			control.valueChanges.subscribe(() => {
				field.onChange!(form);
				this.emitFilterChange(form);
			});
		}
		if (control && field.localizable) {
			this.setLocalizedValue(form, field);
			control.valueChanges.subscribe(() => {
				this.setTranslations(form, field);
			});
		}

		if (field.onInit && control) {
			field.onInit!(form);
		}
	}

	initTranslations(form: FormGroup, fields: FormField[]) {
		for (const field of fields) {
			this.setTranslations(form, field);
		}
	}

	setLocalizedValue = (form: FormGroup, field: FormField) => {
		runInInjectionContext(this.injector, () => {
			effect(() => {
				const locale = this.selectedLocale();
				const translations = form.get('formTranslations')?.value ?? [];
				const translation = translations.find((item: any) => item.locale == locale && item.column_name == field.key);
				const localizedValue = translation?.value ?? '';
				if (form && field.key) {
					form.get(field.key)?.setValue(localizedValue, { emitEvent: false });
				}
			});
		});
	};

	setTranslations = (form: FormGroup, field: FormField) => {
		const locale = this.selectedLocale();
		const translations = form.get('formTranslations')?.value ?? [];
		const translation = translations.find((item: any) => item.locale == locale && item.column_name == field.key);
		const value = form.get(field.key)?.value ?? '';
		if (translation) {
			translation.value = value;
		} else {
			translations.push({
				column_name: field.key,
				locale: locale,
				value: value,
				type: field.type
			})
		}
	}

	initValidators(form: FormGroup, field: FormField, control: any, mode: string) {
		const validators = field.type == 'file' && mode == 'edit' ? [] : (field.validators ?? []);

		// Important: force rebind with the updated parent context
		control.setValidators(validators);
		control.updateValueAndValidity({ onlySelf: true, emitEvent: false });

		setTimeout(() => {
			form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
		});
	}

	async initOptionsFromSource(field: FormField, control: any) {
		if (field.optionsSource) {
			const signal = this.dataService.getSignal(field.optionsSource);
			if (!signal || signal && signal().length === 0) {
				await this.preloadService.load(field.optionsSource, null, field);
			}
			const allOptions = this.dataService.getValue(field.optionsSource);
			field.options = allOptions.map((item: any) => ({
				label: item.name ?? item.title ?? item.label,
				value: item.id,
				...item
			}));
		}
	}

	async filterByParentField(form: FormGroup, field: FormField, control: any) {
		const parentControl = form.get(field.dependsOn!);

		const applyFilter = (parentValue: any) => {
			const allOptions = this.dataService.getValue(field.optionsSource!);
			field.options = allOptions
				.filter((opt: any) => opt[field.filterByParent!] === parentValue)
				.map((opt: any) => ({
					label: opt.name ?? opt.title ?? opt.label,
					value: opt.id,
					...opt
				}));

			control?.setValue(null);
		};

		parentControl?.valueChanges.subscribe(applyFilter);

		const initialParentValue = parentControl?.value;
		if (initialParentValue) {
			applyFilter(initialParentValue);
		}
	}

	async loadOptionsBasedOnParent(form: FormGroup, field: FormField, control: any) {
		const parentControl = form.get(field.dependsOn!);
		parentControl?.valueChanges.subscribe(async (value) => {
			field.options = await field.loadOptions?.(value);
			control?.reset();
		});
	}
}
