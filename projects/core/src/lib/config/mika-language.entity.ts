import { Validators } from "@angular/forms";
import { MikaEntityConfig } from "../interfaces/entity/mika-entity-config.interface";
import { inject } from "@angular/core";
import { MikaLanguageService } from "../services/mika-language.service";

export const mikaLanguageEntity = () => {
	const lang = inject(MikaLanguageService);
	const config: MikaEntityConfig = {
		contentType: 'languages',
		// endpoint: 'localStorage',
		// tableIdColumn: 'locale',
		generateId: false,
		actions: {
			items: {
				create: true,
				delete: true,
				search: true,
				edit: true,
				custom: [
					{
						title: 'set-default',
						handler: (item: any) => {

						}
					},
					{
						title: 'set-dashboard-lang',
						handler: (item: any) => {
							lang.setDashboardLanguage(item);
						}
					}
				]
			},
		},
		sidebarConfig: {
			showInSidebar: false
		},
		table: {
			columns: [
				{
					key: 'title',
					label: 'title',
					renderType: 'text',
				},
				{
					key: 'locale',
					label: 'locale',
					renderType: 'text',
				},
				{
					key: 'direction',
					label: 'direction',
					renderType: 'text',
				},
				{
					key: 'order',
					label: 'sort',
					renderType: 'text',
					allowDisplayNullOrEmpty: true
				},
			],
		},

		form: {
			fields: [
				{
					key: 'title',
					label: 'title',
					type: 'text',
					validators: [Validators.required]
				},
				{
					key: 'locale',
					label: 'locale',
					type: 'text',
					validators: [Validators.required]
				},
				{
					key: 'direction',
					label: 'direction',
					type: 'select',
					options: [
						{label: 'RTL', value: 'rtl'},
						{label: 'LRT', value: 'ltr'},
					],
					validators: [Validators.required]
				},
				{
					key: 'order',
					label: 'sort',
					type: 'number'
				},
			]
		}


	}
	return config;
}
