import { Type } from '@angular/core';
import { MikaTextFieldComponent } from './mika-text-field';
import { MikaTextareaFieldComponent } from './mika-textarea-field';
import { MikaMultiSelectFieldComponent } from './mika-multiselect-field';
import { MikaCheckboxFieldComponent } from './mika-checkbox-field';
import { MikaDateFieldComponent } from './mika-date-field';
import { MikaTimeFieldComponent } from './mika-time-field';
import { MikaDateTimeFieldComponent } from './mika-datetime-field';
import { MikaAutocompleteFieldComponent } from './mika-autocomplete-field.component';
import { MikaSelectFieldComponent } from './mika-select-field.component';
import { MikaRichTextFieldComponent } from './mika-richtext-field';
import { MikaFileFieldComponent } from './mika-file-field';
import { MikaToggleFieldComponent } from './mika-toggle-field';
import { MikaFieldType } from '../types/mika-app.type';

const TEXT_INPUT_TYPES: MikaFieldType[] = ['text', 'email', 'number', 'password', 'url', 'tel'];

export const fieldTypeMap: Partial<Record<MikaFieldType, Type<any>>> = {
	...Object.fromEntries(TEXT_INPUT_TYPES.map(type => [type, MikaTextFieldComponent])),
	textarea: MikaTextareaFieldComponent,
	select: MikaSelectFieldComponent,
	multiselect: MikaMultiSelectFieldComponent,
	checkbox: MikaCheckboxFieldComponent,
	date: MikaDateFieldComponent,
	time: MikaTimeFieldComponent,
	datetime: MikaDateTimeFieldComponent,
	autocomplete: MikaAutocompleteFieldComponent,
	richtext: MikaRichTextFieldComponent,
	file: MikaFileFieldComponent,
	toggle: MikaToggleFieldComponent
};
