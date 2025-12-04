import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizePipe } from '../../../pipes/localize';
import { MikaEntityConfig } from '../../../interfaces/entity/mika-entity-config.interface';
import { GetValuePipe } from '../../../pipes/get-value.pipe';
import { IonChip,IonImg } from "@ionic/angular/standalone";

@Component({
	selector: 'app-print',
	templateUrl: './print.component.html',
	styleUrls: ['./print.component.scss'],
	imports: [IonChip, CommonModule, FormsModule, TranslatePipe, LocalizePipe, GetValuePipe, IonImg]
})
export class PrintComponent implements OnInit {

	@Input() items: any[] = [];
	@Input() entityConfig!: MikaEntityConfig;
	@Input() columns: any = [];

	constructor() { }

	ngOnInit() { }

}
