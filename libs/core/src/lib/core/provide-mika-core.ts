import { EnvironmentProviders, inject, Injector, makeEnvironmentProviders, provideAppInitializer } from "@angular/core";
import { MikaAppConfig, MikaAppConfigOptions } from "../schema";
import { LIB_I18N_PATH, MIKA_APP_CONFIG, MIKA_INJECTOR } from "../tokens";
import { MikaEngineService } from "../services";
import { mikaAppInitializer } from "./mika-initializer";

export function provideMikaCore(mikaAppConfig: MikaAppConfigOptions): EnvironmentProviders {
  const path = (mikaAppConfig as MikaAppConfig)?.i18n?.i18nPath || null;

  return makeEnvironmentProviders([
    { provide: MIKA_INJECTOR, useFactory: () => inject(Injector) },
    { provide: MIKA_APP_CONFIG, useValue: mikaAppConfig },
    { provide: LIB_I18N_PATH, useValue: path },

    MikaEngineService,

    // Core bootstrap only (no UI framework)
    provideAppInitializer(() => mikaAppInitializer(inject(Injector))),
  ]);
}
