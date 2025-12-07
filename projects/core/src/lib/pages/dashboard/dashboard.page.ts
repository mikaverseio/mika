import { Component, computed, EnvironmentInjector, inject, OnInit, runInInjectionContext, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonLabel, IonMenuButton, IonSegment, IonSegmentButton, IonTitle, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { Mika } from '../../helpers/mika-app.helper';
import { MikaEngineService } from '../../services/engine/mika-engine.service';
import { MikaWidgetService } from '../../services/engine/mika-widget.service';
import { MikaDashboardConfig, MikaWidgetConfig } from '../../interfaces';
import { MikaContextService } from '../../services';
import { MikaStatCardComponent } from '../../components/dashboard/mika-stat-card.component';
import { generateDefaultDashboard } from '../../config/mika-dashboard.config';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
	standalone: true,
	imports: [IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TranslatePipe, IonSegment, IonSegmentButton, IonLabel, IonMenuButton]
})
export class MikaDashboardPage implements OnInit {
	private context = inject(MikaContextService);
	private widgetService = inject(MikaWidgetService);
	private injector = inject(EnvironmentInjector);

	// Config source signals
	dashboardConfigs = signal<MikaDashboardConfig[]>([]);
	activeDashboardId = signal<string>('');

	// Reactive computation of the active dashboard object
	activeDashboard = computed(() => {
		const id = this.activeDashboardId();
		return this.dashboardConfigs().find(d => d.id === id);
	});

	async ngOnInit(): Promise<void> {
		// We assume the context is fully loaded here (per APP_INITIALIZER logic)

		// Load configurations from context
		const rawConfigs = this.context.getSetting('dashboards', {});

		const dashboards = this.normalizeDashboardConfigs(rawConfigs);
		this.dashboardConfigs.set(dashboards);

		if (dashboards.length > 0) {
			// Set the first dashboard as active by default
			this.activeDashboardId.set(dashboards[0].id);
		}
	}

	resolveComponent(widget: MikaWidgetConfig): Type<any> | null {
		return this.widgetService.resolveWidgetComponent(widget);
	}

	loadDashboard(e: any): void {
		this.activeDashboardId.set(e.details.value!);
	}

	getGridLayout(dashboard: MikaDashboardConfig): string {
		const defaultClass = 'grid-default';
		if (!dashboard.layout) return defaultClass;

		switch (dashboard.layout) {
			case 'grid-2-col':
				return 'grid md:grid-cols-2 gap-4';
			case 'grid-3-col':
				return 'grid md:grid-cols-3 gap-4';
			default:
				return defaultClass;
		}
	}

	getWidgetSize(widget: MikaWidgetConfig): string {
		if (!widget.size) return 'col-span-1';
		switch (widget.size) {
			case 'medium':
				return 'md:col-span-2';
			case 'large':
				return 'md:col-span-3';
			default:
				// Allows custom classes like 'col-span-1'
				return widget.size;
		}
	}

	// --- Normalization Helpers (Can be extracted to normalizers file) ---

	private normalizeDashboardConfigs(raw: Record<string, MikaDashboardConfig>): MikaDashboardConfig[] {
		let dashboards = Object.values(raw);

		if (dashboards.length === 0) {
			runInInjectionContext(this.injector, () => {
				dashboards = [generateDefaultDashboard()]
			});
		}

		console.log('---dashboards', dashboards);

		return dashboards.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
	}
}
