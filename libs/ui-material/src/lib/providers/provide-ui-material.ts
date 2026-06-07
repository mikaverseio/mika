import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MIKA_UI_PORT } from '@mikaverse/core';
import { CustomMatPaginatorIntl } from './custom-paginator-intl';
import { MikaUiMaterialPort } from '../services/mika-ui-port.service';

export function provideUiMaterial(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MIKA_UI_PORT, useClass: MikaUiMaterialPort },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    importProvidersFrom(MatNativeDateModule),
  ]);
}
