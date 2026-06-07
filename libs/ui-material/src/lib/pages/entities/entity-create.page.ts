import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaFormComponent } from '../../components/form/mika-form/form.component';
import { MikaContextService } from '@mikaverse/core';
import { MikaEntityConfig } from '@mikaverse/core';

@Component({
  selector: 'mika-entity-create-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, MikaFormComponent],
  template: `
    <ng-container *ngIf="entityConfig; else missing">
      <mika-form [config]="entityConfig" mode="create"></mika-form>
    </ng-container>
    <ng-template #missing>
      <p>{{ 'mf-no-entity-config' | translate }}</p>
    </ng-template>
  `,
})
export class EntityCreatePage implements OnInit {
  entityConfig: MikaEntityConfig | undefined;
  private route = inject(ActivatedRoute);
  private context = inject(MikaContextService);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;
    this.entityConfig = this.context.entityConfigs().get(slug);
  }
}
