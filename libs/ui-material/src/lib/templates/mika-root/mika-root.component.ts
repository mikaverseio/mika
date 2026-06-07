import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MikaSidebarService } from '../../services/mika-sidebar.service';
import { MikaAuthService, MikaContextService } from '@mikaverse/core';

@Component({
  selector: 'mika-root-material',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './mika-root.component.html',
  styleUrls: ['./mika-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MikaRootMaterialComponent {
  sidebar = inject(MikaSidebarService);
  auth = inject(MikaAuthService);
  context = inject(MikaContextService);
  private router = inject(Router);

  get allApps() {
    return this.context.getAllApps();
  }

  get activeAppId() {
    return this.context.getActiveAppId();
  }

  async switchApp(appId: string) {
    await this.context.activateApp(appId);
    this.router.navigate(['/dashboard']);
  }
}
