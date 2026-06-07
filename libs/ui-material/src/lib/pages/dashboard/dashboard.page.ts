import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MikaContextService, MikaEntityConfig } from '@mikaverse/core';

@Component({
  selector: 'mika-dashboard-material',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-header">
      <h1 class="dashboard-title">Welcome to {{ context.settings()?.siteName || 'Mika' }}</h1>
      <p class="dashboard-subtitle">Config-driven Angular admin engine</p>
    </div>

    <div class="entity-grid">
      @for (entry of entities; track entry[0]) {
        <mat-card class="entity-card" [routerLink]="['/', entry[0]]">
          <mat-card-content>
            <mat-icon class="entity-icon">{{ entry[1].sidebarConfig?.icon || 'table_rows' }}</mat-icon>
            <div class="entity-info">
              <span class="entity-name">{{ entry[1].sidebarConfig?.label || entry[0] }}</span>
              <span class="entity-type">{{ entry[0] }}</span>
            </div>
            <mat-icon class="entity-arrow">chevron_right</mat-icon>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .dashboard-header {
      margin-bottom: 32px;
    }
    .dashboard-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--mika-text);
      margin: 0 0 6px;
    }
    .dashboard-subtitle {
      color: var(--mika-text-secondary);
      margin: 0;
      font-size: 14px;
    }
    .entity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
    .entity-card {
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.15s;
      border-radius: 12px !important;
      &:hover {
        box-shadow: var(--mika-shadow-lg);
        transform: translateY(-2px);
      }
      mat-card-content {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px !important;
      }
    }
    .entity-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--mika-accent);
    }
    .entity-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .entity-name {
      font-weight: 600;
      font-size: 15px;
      color: var(--mika-text);
      text-transform: capitalize;
    }
    .entity-type {
      font-size: 12px;
      color: var(--mika-text-muted);
    }
    .entity-arrow {
      color: var(--mika-border-strong);
    }
  `],
})
export class DashboardMaterialPage {
  context = inject(MikaContextService);

  get entities(): [string, MikaEntityConfig][] {
    const map = this.context.entityConfigs() as Map<string, MikaEntityConfig> | undefined;
    return Array.from(map?.entries() ?? []);
  }
}
