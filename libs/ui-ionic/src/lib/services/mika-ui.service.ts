import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MikaUiService {
  showToast(message: string, color: string = 'primary') {
    console.log(`[Toast:${color}] ${message}`);
  }
}
