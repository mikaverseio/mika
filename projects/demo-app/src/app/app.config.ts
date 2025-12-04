import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { makeMikaBlogApp } from '../mika-apps/mika-blog/mika-blog.app';
import { provideMika } from '@mikaverse/core';
// import '../mika-apps/mika.bootstrap'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideMika(makeMikaBlogApp())
  ]

};
