import { Routes } from "@angular/router";
import { LoggedGuard } from "../guards/logged.guard";
import { MikaAuthGuard } from "../guards/auth.guard";
import { mikaFormGuard } from "../guards/mika-form.guard";
import { MikaNotFoundComponent } from "../components/pages/not-found/not-found.component";
import { MikaEntityGuard } from "../guards/mika-entity.guard";

export const mikaRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('../pages/dashboard/dashboard.page').then(m => m.MikaDashboardPage),
		canActivate: [MikaAuthGuard]
	},
	{
		path: 'welcome',
		loadComponent: () => import('../pages/welcome/welcome.page').then(m => m.MikaWelcomePage),
		canActivate: [LoggedGuard]
	},
	{
		path: 'not-found',
		loadComponent: () => import('../components/pages/not-found/not-found.component').then(m => m.MikaNotFoundComponent),
		canActivate: [LoggedGuard]
	},

	{
		path: 'login',
		loadComponent: () => import('../pages/auth/login/login.page').then(m => m.MikaLoginPage),
		canActivate: [LoggedGuard]
	},

	{
		path: ':appId/login',
		loadComponent: () => import('../pages/auth/login/login.page').then(m => m.MikaLoginPage),
		// canActivate: [LoggedGuard]
	},

	{
		path: 'dashboard',
		loadComponent: () => import('../pages/dashboard/dashboard.page').then(m => m.MikaDashboardPage),
		canActivate: [MikaAuthGuard]
	},

	{
		path: 'mika',
		children: [
			{
				path: 'settings',
				loadComponent: () => import('../pages/mika/settings/settings.page').then(m => m.MikaSettingsPage),
			},
			{
				path: 'settings/global',
				loadComponent: () => import('../pages/settings-global/settings-global.page').then(m => m.MikaSettingsGlobalPage)
			},
			{
				path: 'help',
				loadComponent: () => import('../pages/mika/help/help.page').then(m => m.MikaHelpPage)
			}
		]
	},

	{
		path: 'sortable/:slug/:field',
		loadComponent: () => import('../pages/sortable/sortable.page').then(m => m.MikaSortablePage),
		canActivate: [MikaAuthGuard, MikaEntityGuard]
	},
	{
		path: ':slug',
		loadComponent: () => import('../pages/entities/entity-list/entity-list.page').then(m => m.MikaEntityListPage),
		canActivate: [MikaAuthGuard, MikaEntityGuard]
	},
	// {
	// 	path: ':slug',
	// 	loadComponent: () => import('../components/table/mika-table-mobile/mika-table-mobile.component').then(m => m.MikaTableMobileComponent),
	// 	canActivate: [MikaAuthGuard]
	// },
	{
		path: ':slug/create',
		loadComponent: () => import('../pages/entities/entity-create/entity-create.page').then(m => m.MikaEntityCreatePage),
		canActivate: [MikaAuthGuard, MikaEntityGuard],
		canDeactivate: [mikaFormGuard]
	},
	{
		path: ':slug/view',
		loadComponent: () => import('../pages/entities/entity-view/entity-view.page').then(m => m.MikaEntityViewPage),
		canActivate: [MikaAuthGuard, MikaEntityGuard],
	},
	{
		path: ':slug/edit/:id',
		loadComponent: () => import('../pages/entities/entity-edit/entity-edit.page').then(m => m.MikaEntityEditPage),
		canActivate: [MikaAuthGuard, MikaEntityGuard],
		canDeactivate: [mikaFormGuard]
	},

	{ path: '**', component: MikaNotFoundComponent },
]
