import { Component } from '@angular/core';
import { MikaRootComponent } from '@mikaverse/core';

@Component({
  selector: 'app-root',
   imports: [MikaRootComponent],
  template: `<mika-root></mika-root>`,
  standalone: true,
})
export class AppComponent {
  title = 'demo-app';
}
