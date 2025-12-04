import { inject, Injectable, Injector, signal } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { MikaEntityConfig } from '../../interfaces/entity/mika-entity-config.interface';
import { MikaFieldConfig } from '../../interfaces/field/mika-field-config.interface';
import { MikaFormBuilderService } from './mika-form-builder.service';
import { MikaDesignSystem, MikaFormMode } from '../../types/mika-app.type';
import { MikaKey } from '../../enum/mika-key.enum';

@Injectable({ providedIn: 'root' })
export class MikaFormContextService extends ControlContainer {

	private _config = signal<MikaEntityConfig | null>(null);
	private _mode = signal<MikaFormMode>('create');
	private _id = signal<number | string | null>(null);
	private _designSystem = signal<MikaDesignSystem>('material');

	config = this._config.asReadonly();
	mode = this._mode.asReadonly();
	id = this._id.asReadonly();
	designSystem = this._designSystem.asReadonly();

	contentId: string | number = "";

	form!: FormGroup;
	formId!: string;
	selectedTab = signal('main');

	setContext(config: MikaEntityConfig, form: FormGroup, contentId: string | number, mode: MikaFormMode) {
		this.form = form;
		let formMode = '';

		if (contentId && !mode) {
			formMode = 'edit';
			this.formId = `${MikaKey.FormIdPrefix}${config.contentType}-edit.${contentId}`;
		} else if (!contentId && !mode) {
			formMode = 'create';
			this.formId = `${MikaKey.FormIdPrefix}${config.contentType}-create.${Math.random().toString(36).substring(2, 10)}`;
		} else {
			formMode = mode;
			this.formId = `${MikaKey.FormIdPrefix}${config.contentType}-${mode}.${Math.random().toString(36).substring(2, 10)}`;
		}

		this._config.set(config);
		this._mode.set(mode);
		this._id.set(contentId);

		// this._config.set(config);
	}

	override get control(): FormGroup {
		return this.form;
	}

	override get path(): string[] {
		return [];
	}

	addControl(path: string, control: AbstractControl) {
		this.form.addControl(path, control);
	}

	addControls(group: { [key: string]: AbstractControl }) {
		Object.entries(group).forEach(([key, control]) => {
			this.form.addControl(key, control);
		});
	}

	async addFields(fields: MikaFieldConfig[], subscribeToChanges: boolean = false) {
		for (const field of fields) {
			const control = new FormControl(field.defaultValue ?? null, field.validators ?? []);
			this.form.addControl(field.key, control);
		}

		// await this.builder.enhanceFields(this.form, fields, subscribeToChanges);
	}

	getControl<T extends AbstractControl = AbstractControl>(path: string): T {
		return this.form.get(path) as T;
	}

	onTabChange(e: any) {
		this.selectedTab.set(e.detail.value);
	}


	resetContext() {
		// this._form.set(null);
		this._config.set(null);
		this._mode.set('create');
		this._id.set(null);
		this._designSystem.set('material');
	}

	get tabbedComponents() {
		const dynamicComponents = this.config()?.form.components ?? [];
		return dynamicComponents.filter((c: any) => {
			const matchesTab = c.position === 'tabbed' && (c.mode === 'all' || c.mode === this.mode());
			if (!matchesTab) return false;

			if (typeof c.renderIf === 'function') {
				return c.renderIf(this.form);
			}

			if (typeof c.renderIf === 'string') {
				return this.form?.get(c.renderIf)?.value === true;
			}

			return true;
		});
	}

	get groupedFields(): Array<{ key: string; fields: MikaFieldConfig[] }> {
		const groups: Record<string, MikaFieldConfig[]> = {};

		for (const field of this.config()?.form.fields!) {
			const groupKey = field.group || 'General';
			if (!groups[groupKey]) groups[groupKey] = [];
			groups[groupKey].push(field);
		}

		const priority = ['General', 'Content', 'Options'];

		const sorted = Object.entries(groups)
			.map(([key, fields]) => ({ key, fields }))
			.sort((a, b) => {
				const aIndex = priority.indexOf(a.key);
				const bIndex = priority.indexOf(b.key);
				if (aIndex === -1 && bIndex === -1) return a.key.localeCompare(b.key);
				if (aIndex === -1) return 1;
				if (bIndex === -1) return -1;
				return aIndex - bIndex;
			});

		return sorted;
	}
}
