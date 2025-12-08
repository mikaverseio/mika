import { Component, computed, DestroyRef, inject, OnInit, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonLabel, IonMenuButton, IonSegment, IonSegmentButton, IonTitle, IonToolbar, IonButtons, IonSpinner, IonIcon, IonButton, IonPopover, IonList, IonItem } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaWidgetService } from '../../services/engine/mika-widget.service';
import { MikaDashboardConfig, MikaDashboardGroup, MikaEntityConfig, MikaWidgetConfig } from '../../interfaces';
import { MikaContextService, MikaDashboardService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { from, switchMap, tap } from 'rxjs';
import { getGroupGridLayout, getWidgetSize } from '../../utils/dashboard.util';
import { RouterModule } from '@angular/router';
import { MikaThemeToggleComponent } from "../../components/ui/mika-theme-toggle/mika-theme-toggle.component";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
	standalone: true,
	imports: [IonItem, IonList, IonPopover, IonSpinner, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslatePipe, IonSegment, IonSegmentButton, IonLabel, IonMenuButton, IonIcon, IonButton, RouterModule, MikaThemeToggleComponent, FormsModule, MatTooltipModule]
})
export class MikaDashboardPage implements OnInit {
	private widgetService = inject(MikaWidgetService);
	private dashboard = inject(MikaDashboardService);
	public context = inject(MikaContextService);
	private destroyRef = inject(DestroyRef);

	// signals
	dashboardConfigs = signal<MikaDashboardConfig[]>([]);
	activeDashboardId = signal<string>('');
	loading = signal<boolean>(false);
	error = signal<string | null>(null);

	// computed helper
	activeDashboard = computed(() => {
		const id = this.activeDashboardId();
		return this.dashboardConfigs().find(d => d.id === id) ?? null;
	});

	entities: MikaEntityConfig[] = [];

	constructor() {
		// Subscribe to context changes and refresh dashboards when context changes
		// We use takeUntilDestroyed to automatically clean up on destroy.
		this.context.contextChange$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				tap(appId => console.debug(`[MikaDashboardPage] Context change detected: ${appId}. Refreshing dashboards.`)),
				switchMap(() => from(this.refreshDashboards()))
			)
			.subscribe({
				error: (err: any) => {
					console.error('[MikaDashboardPage] Failed to refresh dashboards after context change:', err);
				}
			});
	}

	async ngOnInit(): Promise<void> {
		await this.refreshDashboards();
	}

	/** Refresh dashboards and preserve active selection if possible */
	async refreshDashboards(): Promise<void> {
		this.loading.set(true);
		this.error.set(null);

		const previousActive = this.activeDashboardId();

		try {
			const dashboards = await this.dashboard.getDashboards();
			this.dashboardConfigs.set(dashboards);

			// preserve previous active if still available; otherwise pick first
			if (previousActive && dashboards.some(d => d.id === previousActive)) {
				this.activeDashboardId.set(previousActive);
			} else if (dashboards.length > 0) {
				this.activeDashboardId.set(dashboards[0].id);
			} else {
				this.activeDashboardId.set('');
			}
		} catch (err: any) {
			console.error('[MikaDashboardPage] Error loading dashboards:', err);
			this.error.set(err?.message ?? 'Failed to load dashboards');
			// keep previous state as-is (don't clobber)
		} finally {
			this.loading.set(false);

			console.log('===== done dashboard ===');
		}
	}

	/** Triggered by context or by user action to force reload */
	async forceReload(): Promise<void> {
		this.loading.set(true);
		try {
			const dashboards = await this.dashboard.refresh();
			this.dashboardConfigs.set(dashboards);
			if (dashboards.length > 0) this.activeDashboardId.set(dashboards[0].id);
		} catch (err: any) {
			console.error('[MikaDashboardPage] forceReload failed', err);
			this.error.set(err?.message ?? 'Force reload failed');
		} finally {
			this.loading.set(false);
		}
	}

	resolveComponent(widget: MikaWidgetConfig): Type<any> | null {
		return this.widgetService.resolveWidgetComponent(widget);
	}

	loadDashboard(e: any): void {
		this.activeDashboardId.set(e.detail.value!);
	}

	getGroupGridLayout(group: MikaDashboardGroup): string {
		return getGroupGridLayout(group);
	}

	getWidgetSize(widget: MikaWidgetConfig): string {
		return getWidgetSize(widget);
	}
}
