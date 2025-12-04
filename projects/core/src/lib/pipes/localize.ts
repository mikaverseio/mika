import { Pipe, PipeTransform } from '@angular/core';
import { localize } from '../utils/localization-utils';

@Pipe({
	name: 'localize',
	pure: false,
})

export class LocalizePipe implements PipeTransform {
	constructor() { }
	transform(item: any, field: string | undefined = 'title', locale?: string): string {
		return localize(item, field, locale);
	}
}
