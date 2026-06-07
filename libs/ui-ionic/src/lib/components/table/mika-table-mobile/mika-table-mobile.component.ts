import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mika-table-mobile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="placeholder-table-mobile">
      <p>Mobile table placeholder for "{{ entityConfig?.contentType || 'entity' }}".</p>
    </div>
  `
})
export class MikaTableMobileComponent {
  @Input() entityConfig: any;
  @Input() items: any[] = [];
}
