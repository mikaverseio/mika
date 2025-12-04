import { Component, inject, Injector, Input, Type } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fieldTypeMap } from './field-type-map';
import { DynamicFieldComponentResolver } from '../resolvers/dynamic-field-component.resolver';
import { MikaFieldType } from '../types/mika-app.type';
@Component({
	selector: 'mika-fields',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
	template: `
		@for (field of fields; track field.key) {
			@if (!field.renderIf || field.renderIf(form)) {
				<ng-container *ngComponentOutlet="resolve(field.type); inputs: { field: field, form: form }"/>
			}
		}
  	`
})
export class MikaFieldsComponent {
	@Input() fields: any;
	@Input() form!: FormGroup;
	fieldTypeMap: any = fieldTypeMap;

	resolver = inject(DynamicFieldComponentResolver);
	resolve(type: MikaFieldType) {
		return fieldTypeMap[type]!
		// return this.resolver.resolveComponent(type)!;
	}
}
