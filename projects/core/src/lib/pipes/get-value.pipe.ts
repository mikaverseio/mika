import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MikaColumnConfig } from '../interfaces/table/mika-column-config.interface';
import { localize } from '../utils/localization-utils';

@Pipe({ name: 'getValue', pure: true })
export class GetValuePipe implements PipeTransform {

	private translate = inject(TranslateService);

	transform(item: any, column: MikaColumnConfig, fallback: any = '', locale?: string): any {

		if (!item || !column) return fallback;

		let value = column.key?.split('.').reduce((obj, key) => obj?.[key], item) ?? fallback;

		if (column.allowDisplayNullOrEmpty) {
			if (column.nullOrEmptyFallback !== undefined) return column.nullOrEmptyFallback;
			return value;
		}

		// if (value === undefined || value === null || value === '') {
		// 	value = item;
		// }

		if (column.translatable) {
			return this.translate.instant(value);
		}

		if (column.localizable) {
			if (typeof item[column.key] === 'object') {
				return localize(item[column.key] || item, column.key, locale);
			} else {
				return localize(item, column.key, locale);
			}
		}

		return value;
	}
}
