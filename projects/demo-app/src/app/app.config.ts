import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideMikaForm } from '@mikaverse/core';
import { makeMikaBlogApp } from '../mika-apps/mika-blog/mika-blog.app';
// import '../mika-apps/mika.bootstrap'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideMikaForm(makeMikaBlogApp())
  ]

};
