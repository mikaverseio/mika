import { Routes } from "@angular/router";
import { LoggedGuard } from "../guards/logged.guard";
import { MikaAuthGuard } from "../guards/auth.guard";
import { mikaFormGuard } from "../guards/mika-form.guard";
import { NotFoundComponent } from "../components/pages/not-found/not-found.component";

export const mikaRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('../pages/dashboard/dashboard.page').then(m => m.DashboardPage),
		canActivate: [MikaAuthGuard]
	},
	{
		path: 'not-found',
		loadComponent: () => import('../components/pages/not-found/not-found.component').then(m => m.NotFoundComponent),
		canActivate: [LoggedGuard]
	},

	{
		path: 'login',
		loadComponent: () => import('../pages/auth/login/login.page').then(m => m.LoginPage),
		canActivate: [LoggedGuard]
	},

	{
		path: ':appId/login',
		loadComponent: () => import('../pages/auth/login/login.page').then(m => m.LoginPage),
		// canActivate: [LoggedGuard]
	},

	{
		path: 'dashboard',
		loadComponent: () => import('../pages/dashboard/dashboard.page').then(m => m.DashboardPage),
		canActivate: [MikaAuthGuard]
	},

	{
		path: 'mika',
		children: [
			{
				path: 'settings',
				loadComponent: () => import('../pages/mika/settings/settings.page').then(m => m.SettingsPage),
			},
			{
				path: 'settings/global',
				loadComponent: () => import('../pages/settings-global/settings-global.page').then(m => m.SettingsGlobalPage)
			},
			{
				path: 'help',
				loadComponent: () => import('../pages/mika/help/help.page').then(m => m.HelpPage)
			}
		]
	},

	{
		path: 'sortable/:slug/:field',
		loadComponent: () => import('../pages/sortable/sortable.page').then(m => m.SortablePage),
		canActivate: [MikaAuthGuard]
	},
	{
		path: ':slug',
		loadComponent: () => import('../pages/entities/entity-list/entity-list.page').then(m => m.EntityListPage),
		canActivate: [MikaAuthGuard]
	},
	// {
	// 	path: ':slug',
	// 	loadComponent: () => import('../components/table/mika-table-mobile/mika-table-mobile.component').then(m => m.MikaTableMobileComponent),
	// 	canActivate: [MikaAuthGuard]
	// },
	{
		path: ':slug/create',
		loadComponent: () => import('../pages/entities/entity-create/entity-create.page').then(m => m.EntityCreatePage),
		canActivate: [MikaAuthGuard],
		canDeactivate: [mikaFormGuard]
	},
	{
		path: ':slug/view',
		loadComponent: () => import('../pages/entities/entity-view/entity-view.page').then(m => m.MikaEntityViewPage),
		canActivate: [MikaAuthGuard],
	},
	{
		path: ':slug/edit/:id',
		loadComponent: () => import('../pages/entities/entity-edit/entity-edit.page').then(m => m.EntityEditPage),
		canActivate: [MikaAuthGuard],
		canDeactivate: [mikaFormGuard]
	},

	{ path: '**', component: NotFoundComponent },
]
