import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'mika-blog-about',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div style="padding: 32px; max-width: 720px; margin: 0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>About MikaBlog</mat-card-title>
          <mat-card-subtitle>Config-driven Angular admin engine</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content style="padding-top: 16px;">
          <p>
            MikaBlog is a demo app built on <strong>Mika</strong> — a config-driven, API-agnostic
            Angular admin engine. Every list, form, and action you see here is defined entirely in
            TypeScript config objects, with zero hand-written HTML for CRUD screens.
          </p>
          <p style="margin-top: 12px;">
            This page itself is a <strong>custom route</strong>: it lives outside the engine's
            generated CRUD shell, proving that you can drop in arbitrary pages alongside the
            config-driven ones using the <code>customRoutes</code> option in
            <code>MikaAppConfig</code>.
          </p>
          <ul style="margin-top: 12px; padding-left: 20px;">
            <li>Engine: <strong>&#64;mikaverse/core</strong></li>
            <li>UI: <strong>&#64;mikaverse/ui-material</strong> (Angular Material)</li>
            <li>Mock API: <strong>json-server</strong> (db-demo2.json)</li>
          </ul>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class AboutPage {}
