import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MikaConfirmOptions, MikaUiPort } from '@mikaverse/core';
import { ConfirmDialogComponent } from '../components/ui/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MikaUiMaterialPort implements MikaUiPort {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  private _loading = signal(false);
  readonly isLoading = this._loading.asReadonly();

  async confirm(options: MikaConfirmOptions): Promise<{ role?: string }> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: options,
      width: '380px',
      disableClose: true,
    });
    const result = await firstValueFrom(ref.afterClosed());
    return result ?? { role: 'cancel' };
  }

  showLoading(_message?: string): void {
    this._loading.set(true);
  }

  hideLoading(): void {
    this._loading.set(false);
  }

  toastSuccess(message: string): void {
    this.snackBar.open(this.translate.instant(message), undefined, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mika-snack-success'],
    });
  }

  toastError(message: string): void {
    this.snackBar.open(this.translate.instant(message), undefined, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mika-snack-error'],
    });
  }
}
