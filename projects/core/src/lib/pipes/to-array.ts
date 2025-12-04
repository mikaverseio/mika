import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'toArray',
})
export class toArrayPipe implements PipeTransform {

    constructor() { }

    transform(items: any): any {
		return Object.keys(items).map(key => items[key]);
    }
}
