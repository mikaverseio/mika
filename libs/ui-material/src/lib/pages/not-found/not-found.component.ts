import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mika-not-found-material',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-title>404</mat-card-title>
      <mat-card-content>Page not found.</mat-card-content>
      <button mat-raised-button color="primary" routerLink="/">Home</button>
    </mat-card>
  `,
})
export class NotFoundMaterialComponent {}
