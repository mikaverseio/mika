import { Component, OnInit } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MikaPanelComponent } from '../mika-panel/mika-panel.component';

@Component({
  selector: 'mika-panels',
  imports: [MatAccordion, MatExpansionModule,],
  template: `
	<mat-accordion multi>
		<ng-content></ng-content>
	</mat-accordion>
  `
})
export class MikaPanelsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
