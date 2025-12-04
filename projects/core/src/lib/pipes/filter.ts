import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
})
export class FilterPipe implements PipeTransform {

    transform(data: Array<any>, key: any, field: string = 'title'): Array<any> {
        return data && data?.length ? data.filter(getData) : [];
        function getData(item: any, index: number) {
            if (!key || item[field] == key) {
                return data[index];
            }
        };
    };
}