import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
	constructor(private translate: TranslateService) {
		super();
		this.getAndSetLabels();

		this.translate.onLangChange.subscribe(() => {
			this.getAndSetLabels();
			this.changes.next();
		});
	}

	private getAndSetLabels() {
		this.itemsPerPageLabel = this.translate.instant('items-per-page');
		this.nextPageLabel = this.translate.instant('next-page');
		this.previousPageLabel = this.translate.instant('previous-page');
		this.firstPageLabel = this.translate.instant('first-page');
		this.lastPageLabel = this.translate.instant('last-page');
		this.getRangeLabel = (page: number, pageSize: number, length: number) => {
			const startIndex = page * pageSize;
			const endIndex = Math.min(startIndex + pageSize, length);
			return this.translate.instant('page-range', {
				start: startIndex + 1,
				end: endIndex,
				total: length,
			});
		};
	}
}
