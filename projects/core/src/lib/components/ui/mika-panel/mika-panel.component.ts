import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
	selector: 'mika-panel',
	standalone: true,
	imports: [CommonModule, MatExpansionModule],
	template: `
    <mat-accordion [multi]="multi">
      <mat-expansion-panel [expanded]="expanded">
        <mat-expansion-panel-header>
          <ng-content select="[panel-title]"></ng-content>
        </mat-expansion-panel-header>
        <ng-content></ng-content>
      </mat-expansion-panel>
    </mat-accordion>
  `,
	styles: [`
    mat-expansion-panel {
      margin-bottom: 10px;
    }
  `]
})
export class MikaPanelComponent {
	@Input() expanded = false;
	@Input() multi = false;
}
