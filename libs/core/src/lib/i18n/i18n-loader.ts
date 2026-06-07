import { from, Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Inject, Optional } from '@angular/core';
import { deepMerge } from '../utils';
import { languageMap } from './lang-map';
import { LIB_I18N_PATH } from '../tokens';

export class HybridLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    @Optional() @Inject(LIB_I18N_PATH) private overridePath: string | null
  ) {}

  getTranslation(lang: string): Observable<any> {
    // 1. Get the Library Data (Lazy Loaded) 💤
    const loadLibData$ = this.getLibraryTranslation(lang);

    // 2. Get the App Data (HTTP Override) 🌐
    const loadAppData$ = this.getAppTranslation(lang);

    // 3. Wait for both, then Merge 🔀
    return forkJoin([loadLibData$, loadAppData$]).pipe(
      map(([libData, appData]) => {
        return deepMerge(libData, appData);
      })
    );
  }

  // --- Helper: Load Library JSON Lazily ---
  private getLibraryTranslation(lang: string): Observable<any> {
    const importer = languageMap[lang];

    if (!importer) {
      console.warn(`Language ${lang} not found in library.`);
      return of({});
    }

    // Convert the Promise (import) to an Observable
    return from(importer()).pipe(
      map((module: any) => {
        // 🛡️ UNPACK FIX: Handle the 'default' export issue automatically
        return module.default ? module.default : module;
      }),
      catchError(err => {
        console.error(`Failed to lazy load library language: ${lang}`, err);
        return of({});
      })
    );
  }

  // --- Helper: Load App Overrides ---
  private getAppTranslation(lang: string): Observable<any> {
    if (!this.overridePath) return of({});

    return this.http.get(`${this.overridePath}${lang}.json`).pipe(
      catchError(() => of({})) // Ignore 404s from app
    );
  }
}
