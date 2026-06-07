import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getValue',
  standalone: true,
})
export class GetValuePipe implements PipeTransform {
  transform(item: any, column: any, locale?: string): any {
    if (!item || !column) return item;

    const key = column.key || column.columnDef;
    let value = item[key];

    if (column.localizable && value && typeof value === 'object' && locale && value[locale] !== undefined) {
      value = value[locale];
    }

    if (typeof column.transformValue === 'function') {
      return column.transformValue(value, item);
    }

    return value;
  }
}
