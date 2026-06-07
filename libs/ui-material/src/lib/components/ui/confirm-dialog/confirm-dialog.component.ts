import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MikaConfirmOptions } from '@mikaverse/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mika-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ data.header | translate }}</h2>
    <mat-dialog-content>{{ data.message | translate }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      @for (btn of data.buttons; track btn.role) {
        <button
          mat-button
          [color]="btn.role === 'confirm' ? 'warn' : ''"
          (click)="dialogRef.close({ role: btn.role })">
          {{ btn.text | translate }}
        </button>
      }
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  data = inject<MikaConfirmOptions>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
}
