import { Component, Input, OnInit, Output, EventEmitter, ViewChild, inject, ViewContainerRef, Injector, OnDestroy, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonButton, IonLoading, IonContent, IonHeader, IonToolbar, IonFooter } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaApiService } from '../../../services/http/mika-api.service';
import { ToastService } from '../../../services/general/app.service';
import { Router } from '@angular/router';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { addIcons } from 'ionicons';
import { close, closeCircle, cloudUpload, save } from 'ionicons/icons';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MikaDataService } from '../../../services/mika-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MikaFormContextService } from '../../../services/form/mika-form-context.service';
import { FormHeaderComponent } from '../form-header/form-header.component';
import { FormFieldsIonicComponent } from "../form-fields-ionic/form-fields-ionic.component";
import { FormFieldsMaterialComponent } from "../form-fields-material/form-fields-material.component";
import { FormTabbedComponentsComponent } from "../form-tabbed-components/form-tabbed-components.component";
import { MikaFormBuilderService } from '../../../services/form/mika-form-builder.service';
import { MikaEngineService } from '../../../services/mika-engine.service';
import { catchError, debounceTime, filter, firstValueFrom, of, Subscription, switchMap, tap } from 'rxjs';
import { Mika } from '../../../helpers/mika-app.helper';
import { MikaContainerComponent } from "../../ui/mika-container/mika-container.component";
import { MikaLocalStorageAdapterService } from '../../../services/mika-localstorage-adapter.service';
import { convertToFormData } from '../../../utils/utils';
import { MikaDesignSystem } from '../../../types/mika-app.type';
import { NotFoundComponent } from '../../pages/not-found/not-found.component';
import { MikaLanguageService } from '../../../services/mika-language.service';

@Component({
  standalone: true,
	selector: 'mika-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	imports: [IonFooter, IonToolbar, IonHeader, IonContent, NotFoundComponent,
		IonButton, TranslatePipe, ReactiveFormsModule, FormsModule, CommonModule, IonLoading,
		MatDatepickerModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatCheckboxModule, MatSelectModule,
		MatSlideToggleModule, MatButtonModule, FormHeaderComponent, FormFieldsIonicComponent, FormFieldsMaterialComponent, FormTabbedComponentsComponent, MikaContainerComponent]
})
export class MikaFormComponent implements OnInit, OnDestroy {

	@Input() id: number | string = "";
	@Input() initialData?: any;
	@Input() config!: MikaEntityConfig;
	@Input() mode!: 'edit' | 'create' | 'view';
	@Input() designSystem: MikaDesignSystem = 'material';
	@Output() submitted = new EventEmitter<any>();

	@ViewChild(IonLoading) loading!: IonLoading;
	@ViewChild('aboveFormContainer', { read: ViewContainerRef }) aboveFormContainer!: ViewContainerRef;
	@ViewChild('belowFormContainer', { read: ViewContainerRef }) belowFormContainer!: ViewContainerRef;

	form!: FormGroup;
	formId!: string;
	ready: boolean = false;
	componentsAfterGroup: Record<string, any[]> = {};
	notFound = signal(false);

	// services
	api = inject(MikaApiService);
	toast = inject(ToastService);
	router = inject(Router);
	mika = inject(MikaEngineService);
	dataService = inject(MikaDataService);
	context = inject(MikaFormContextService);
	formBuilder = inject(MikaFormBuilderService);
	localAdapter = inject(MikaLocalStorageAdapterService);
	languageService = inject(MikaLanguageService);

	private autoSaveSub?: Subscription;
	savingState: 'idle' | 'saving' | 'saved' | 'error' = 'idle';

	constructor() {
		addIcons({ save, close, cloudUpload, closeCircle });
	}

	async ngOnInit() {
		// init form component config
		this.initConfig();

		// init form controls, events, and validation
		await this.initForm();

		// populate form values
		await this.populateValues();

		// load additional dynamic components
		await this.loadComponents();

		// form is ready
		this.ready = true;
	}

	initConfig() {
		if (!this.config) {
			throw new Error('No EntityConfig was provided');
		}

		if (this.mode == 'edit' && !this.id) {
			throw new Error('Edit mode require content ID to present');
		}

		if (this.id) {
			// this.mode = 'edit';
			this.config.contentId = this.id;
			// this.formId = `mikaForm_${this.id}`;
		} else {
			// this.mode = 'create';
			// this.formId = `mikaForm_${Math.random().toString(36).substring(2, 10)}`;
		}
	}

	async initForm() {
		try {
			this.form = this.formBuilder.initForm(this.config.form.fields, this.mode, this.config.localizable ?? false);
			await this.formBuilder.enhanceFields(this.form, this.config.form.fields, this.mode);
			this.setContext();
		} catch (error) {
			console.error(error);
			throw new Error('Failed to init the form');
		}

	}

	async populateValues() {
		if (this.initialData) {
			this.form.patchValue(this.initialData);
		} else if (this.id) {
			await this.loadFormData(this.form);
		}
	}

	async loadFormData(form: FormGroup) {

		// if (this.config.endpoint === 'localStorage') {
		// 	const localData = await this.localAdapter.get(this.config, this.id);
		// 	if (localData) {
		// 		form.patchValue(localData);
		// 	} else {
		// 		this.notFound.set(true);
		// 	}
		// 	return;
		// }

		// const tes = await this.mika.entity.ofConfig(config!).get();
		const request = this.api.config(this.config).getOne(this.id)
		let response = await firstValueFrom(request);
		const nestedStrategyKey = Mika.settings?.languages?.nestedStrategyKey || 'translations';

		if (!response) {
			this.notFound.set(true);
			return;
		}
		if (response[nestedStrategyKey]) {
			response = { ...response, formTranslations: response[nestedStrategyKey] };
		}
		form.patchValue(response);
		this.formBuilder.initTranslations(form, this.config.form.fields);
	}

	ngOnDestroy() {
		this.context.resetContext();
		this.languageService.setFormDefaultLocale();
	}

	setContext() {
		this.context.setContext(this.config, this.form, this.id, this.mode);
	}

	async onSubmit() {
		// validate form before further actions
		this.languageService.setFormDefaultLocale();
		setTimeout(async() => {
			if (this.form.invalid) {
				this.form.markAllAsTouched();
				this.toast.openSnackBar('fields-required', 'warning');
				return;
			}

			// for value;
			let data = this.form.value;

			// if (this.config.endpoint === 'localStorage') {
			// 	await this.localAdapter.addOrUpdate(this.config, data, this.id);
			// 	this.toast.openSnackBar(this.id ? 'update-success-message' : 'create-success-message', 'success');
			// 	this.router.navigate([`/${this.config.contentType}`], { queryParams: { refresh: true } });
			// 	return;
			// }

			// if submitHandler is provided, skip other actions
			// let user handle submission
			if (this.config.submitHandler) {
				return await this.mika.hook.safeExecuteHook('submitHandler', this.config, this.form);
			}

			// should transform any value before submission?
			if (this.config.onSubmitTransform) {
				data = await this.mika.hook.safeExecuteHook('onSubmitTransform', this.config, data);
			}

			if (!data) return;

			// show loader indicator
			await this.loading.present();

			const request$ = this.buildRequest({ ...data });

			try {
				const response = await firstValueFrom(request$);

				const isSuccess = this.config.response?.props?.success
					? !!response[this.config.response?.props?.success]
					: true;

				if (isSuccess) {

					this.form.markAsPristine();
					this.form.markAsUntouched();
					this.form.updateValueAndValidity();

					await this.onSuccess(response);

				} else {
					await this.onError();
				}
			} catch (error) {
				console.error('[MikaForm] Request failed', error);
				await this.onError(error);
			} finally {
				this.loading.dismiss();
			}
		}, 300);
	}

	buildRequest(data: any) {
		const payload = convertToFormData(data, this.config.localizable);
		const apiConfig = this.api.config(this.config);
		return this.id ? apiConfig.patch(this.id, payload) : apiConfig.post(payload);
	}

	private async onSuccess(response: any) {
		this.submitted.emit(response);

		if (this.config.request?.cache) {
			this.mika.cache.invalidateCachedPages(this.config.contentType);
		}

		if (this.config.onSuccess) {
			await this.mika.hook.safeExecuteHook('onSuccess', this.config, response);
			return;
		}

		// if no onSuccess handler is provided, perform defualt actions
		this.toast.openSnackBar(this.id ? 'mf-update-success-message' : 'mf-create-success-message', 'success');
		this.router.navigate([`/${this.config.contentType}`], { queryParams: { refresh: true } });

		if (this.config.onSubmit) {
			await this.mika.hook.safeExecuteHook('onSubmit', this.config, response);
		}
	}

	private async onError(error?: any) {
		this.toast.openSnackBar('mf-create-error-message', 'danger');
		if (this.config.onError) {
			await this.mika.hook.safeExecuteHook('onError', this.config, error)
		}
	}

	private async loadComponents() {
		const dynamicComponents = this.config.form.components ?? [];

		for (const comp of dynamicComponents) {
			if (comp.position === 'top') {
				this.loadComponent(comp, this.aboveFormContainer);
			} else if (comp.position === 'bottom') {
				this.loadComponent(comp, this.belowFormContainer);
			} else if (comp.position === 'after-group' && comp.groupKey) {
				if (!this.componentsAfterGroup[comp.groupKey]) {
					this.componentsAfterGroup[comp.groupKey] = [];
				}
				this.componentsAfterGroup[comp.groupKey].push(comp);
			}
		}
	}

	private loadComponent(config: any, container: ViewContainerRef): void {
		const injector = Injector.create({
			providers: Object.entries(config.inputs || {}).map(([key, value]) => ({
				provide: key,
				useValue: value
			}))
		});
		container.createComponent(config.component, { injector });
	}

	createInjector(inputs: Record<string, any>): Injector {
		return Injector.create({
			providers: Object.entries(inputs).map(([key, value]) => ({
				provide: key,
				useValue: value
			}))
		});
	}

	initAutoSave() {
		const cfg = this.config.form.config;

		if (!cfg?.autoSave || !this.form) return;

		this.autoSaveSub = this.form.valueChanges
			.pipe(
				debounceTime(cfg.autoSaveDebounce ?? 1000), // configurable debounce
				filter(() => this.form.dirty && this.form.valid),
				switchMap(() => {
					this.savingState = 'saving';
					return this.api.patch(`${this.config.endpoints?.get}/${this.id}`, this.form.value)
						.pipe(
							catchError(err => {
								this.savingState = 'error';
								console.error('Auto-save failed', err);
								return of(null);
							}),
							tap(() => {
								this.savingState = 'saved';
								this.form.markAsPristine(); // reset dirty state
								setTimeout(() => this.savingState = 'idle', 1000);
							})
						);
				})
			)
			.subscribe();
	}

}
