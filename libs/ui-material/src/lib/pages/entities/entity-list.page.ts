import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaTableComponent } from '../../components/table/mika-table/table.component';
import { MikaContextService } from '@mikaverse/core';
import { MikaEntityConfig } from '@mikaverse/core';

@Component({
  selector: 'mika-entity-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, MikaTableComponent],
  template: `
    <ng-container *ngIf="entityConfig; else missing">
      <mika-table [entityConfig]="entityConfig" [showActions]="true"></mika-table>
    </ng-container>
    <ng-template #missing>
      <p>{{ 'mf-no-entity-config' | translate }}</p>
    </ng-template>
  `,
})
export class EntityListPage implements OnInit {
  entityConfig: MikaEntityConfig | undefined;
  private route = inject(ActivatedRoute);
  private context = inject(MikaContextService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Use observable (not snapshot) so the component reacts when Angular reuses
    // this instance for a different slug without recreating it.
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const slug = params.get('slug');
        if (!slug) return;
        this.entityConfig = this.context.entityConfigs().get(slug);
      });
  }
}
