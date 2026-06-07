import { Routes } from '@angular/router';
import { MikaAuthGuard } from '@mikaverse/core';

export function getMikaUiMaterialRoutes(): Routes {
  return [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'auth/login', loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginMaterialPage) },
    {
      path: '',
      canActivate: [MikaAuthGuard],
      children: [
        { path: 'dashboard', loadComponent: () => import('./pages').then(m => m.DashboardMaterialPage) },
        {
          path: ':slug', children: [
            { path: '', loadComponent: () => import('./pages').then(m => m.EntityListPage) },
            { path: 'create', loadComponent: () => import('./pages').then(m => m.EntityCreatePage) },
            { path: 'edit/:id', loadComponent: () => import('./pages').then(m => m.EntityEditPage) },
            { path: 'view/:id', loadComponent: () => import('./pages').then(m => m.EntityViewPage) },
          ]
        },
      ]
    },
    { path: '**', loadComponent: () => import('./pages').then(m => m.NotFoundMaterialComponent) },
  ];
}
