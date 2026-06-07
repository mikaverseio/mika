import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MikaSidebarService {
  menus = signal<any[]>([]);
}
