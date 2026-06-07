import { Routes } from '@angular/router';

// TODO: wire real Ionic pages/components; these are placeholders to keep builds green.
export function getMikaUiIonicRoutes(): Routes {
  return [
    { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.MikaDashboardPage) },
    { path: 'welcome', loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.MikaWelcomePage) },
    { path: 'auth/login', loadComponent: () => import('./pages/auth/login/login.page').then(m => m.MikaLoginPage) },
    { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.MikaNotFoundComponent) },
  ];
}
