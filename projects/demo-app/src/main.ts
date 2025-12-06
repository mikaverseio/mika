import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { makeMikaStoreAppAsync } from './mika-apps/mika-store/store.app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
