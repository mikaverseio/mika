import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mika-container',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="mika-container"><ng-content></ng-content></div>`,
  styles: [`
    .mika-container { padding: 16px; }
  `]
})
export class MikaContainerComponent {}
