import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mika-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-table">
      <p>Table placeholder for "{{ entityConfig?.contentType || 'entity' }}".</p>
    </div>
  `
})
export class MikaTableComponent {
  @Input() entityConfig: any;
}
