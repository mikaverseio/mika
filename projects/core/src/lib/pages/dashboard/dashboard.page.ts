import { Component, computed, EnvironmentInjector, inject, OnInit, runInInjectionContext, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonLabel, IonMenuButton, IonSegment, IonSegmentButton, IonTitle, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { MikaWidgetService } from '../../services/engine/mika-widget.service';
import { MikaDashboardConfig, MikaWidgetConfig } from '../../interfaces';
import { MikaContextService } from '../../services';
import { normalizeDashboardConfigs } from '../../normalizers';

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

		const rawConfigs = this.context.getSetting('dashboards', {});
		const dashboards = normalizeDashboardConfigs(rawConfigs, this.injector);

		this.dashboardConfigs.set(dashboards);

		if (dashboards.length > 0) {
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
}
