import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../pipes/localize.pipe';
import { MikaEntityConfig } from '@mikaverse/core';
import { GetValuePipe } from '../../../pipes/get-value.pipe';
import { MatChipsModule } from '@angular/material/chips';

@Component({
	selector: 'app-print',
	templateUrl: './print.component.html',
	styleUrls: ['./print.component.scss'],
	imports: [CommonModule, FormsModule, TranslatePipe, LocalizePipe, GetValuePipe, MatChipsModule]
})
export class PrintComponent implements OnInit {

	@Input() items: any[] = [];
	@Input() entityConfig!: MikaEntityConfig;
	@Input() columns: any = [];

	constructor() { }

	ngOnInit() { }

}
