import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { provideMikaCore, mikaAuthInterceptor, mikaContextInterceptor, HybridLoader } from '@mikaverse/core';
import { getMikaUiMaterialRoutes, provideUiMaterial } from '@mikaverse/ui-material';
import { makeMikaBlogApp } from '../mika-apps/mika-blog/mika-blog.app';
import { makeMikaStoreApp } from '../mika-apps/mika-store/store.app';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(getMikaUiMaterialRoutes()),
    provideHttpClient(withInterceptors([mikaAuthInterceptor, mikaContextInterceptor])),
    provideMikaCore([
      makeMikaBlogApp(),
      makeMikaStoreApp(),
    ]),
    provideUiMaterial(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: HybridLoader, deps: [HttpClient] },
        defaultLanguage: 'en',
      })
    ),
  ],
};
