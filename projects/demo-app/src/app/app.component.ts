import { Component } from '@angular/core';
import { MikaAppComponent } from '@mikaverse/core';

@Component({
  selector: 'app-root',
   imports: [MikaAppComponent],
  template: `<mika-app></mika-app>`,
  standalone: true,
})
export class AppComponent {
  title = 'demo-app';
}
