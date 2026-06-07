import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MikaContextService } from '../services';

/**
 * Global Guard to ensure the engine is configured before accessing secured routes.
 * If no MikaAppConfig is present, users are redirected to the designated welcome/setup page.
 */
export const MikaAppGuard: CanActivateFn = (route, state) => {
    const context = inject(MikaContextService);
    const router = inject(Router);
    const welcomeRoute = '/welcome'; // Define the safe landing path

    // 1. Check if the context has registered any valid apps
    if (context.appsCount() > 0) {
        return true; // Config is present, allow access
    }

    // 2. Check if the user is already attempting to go to the Welcome page
    if (state.url.startsWith(welcomeRoute)) {
        return true; // Allow access to the welcome page itself, otherwise it's a loop.
    }

    // 3. No apps configured: Redirect to the welcome screen component URL.
    console.warn('[MikaGuard] No apps registered. Redirecting to welcome screen.');
    router.navigateByUrl(welcomeRoute);
    return false; // Prevent activation of the original secured route
};
