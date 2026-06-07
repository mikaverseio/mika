import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localize',
  standalone: true,
})
export class LocalizePipe implements PipeTransform {
  transform(value: any, field?: string, locale?: string): any {
    if (value == null) return value;

    const target = field ? value[field] ?? value : value;
    if (target && typeof target === 'object' && locale && target[locale] !== undefined) {
      return target[locale];
    }
    return target;
  }
}
