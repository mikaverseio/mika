import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonText],
  template: `
    <div class="file-upload">
      <input #fileInput type="file" hidden [accept]="accept" (change)="onSelect($event)" />
      <ion-button expand="block" (click)="fileInput.click()">
        <ion-icon slot="start" name="cloud-upload"></ion-icon>
        {{ label }}
      </ion-button>
      <ion-text *ngIf="fileName">{{ fileName }}</ion-text>
    </div>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  }]
})
export class FileUploadComponent {
  @Input() label = 'Upload';
  @Input() accept = '*';
  fileName = '';
  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(val: any): void {
    this.fileName = val || '';
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  onSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileName = file.name;
      this.onChange(file);
      this.onTouched();
    }
  }
}
