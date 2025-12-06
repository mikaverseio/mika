import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { MikaAuthService, MikaConfigService, MikaContextService } from '../services';
import { EMikaAction } from '../enum';

/**
 * Ensures the requested content type (slug) exists within the active tenant's configuration
 * and that the user has the required view permissions for that entity.
 */
export const MikaEntityGuard: CanActivateFn = async (route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> => {
    const context = inject(MikaContextService);
    const config = inject(MikaConfigService);
    const auth = inject(MikaAuthService);
    const router = inject(Router);

    const slug = route.params['slug'];

    // 🛑 CRITICAL FIX 1: Bypass the guard if the slug matches a known SYSTEM route.
    // This prevents the guard from running the expensive existence check on pages that are already defined elsewhere (Routes 2, 3, 4, 6, 7).
    const systemSlugs = ['login', 'welcome', 'not-found', 'dashboard', 'mika', 'home'];

    if (!slug) {
        // If slug is empty, we are matching path: '' or the root dashboard route. Allow.
        return true;
    }

    // 🛑 FIX: If the URL parameter matches a system slug, allow it to pass this entity guard.
    if (systemSlugs.includes(slug)) {
        return true;
    }

    // 1. Load the Configuration (Async)
    // We assume getConfig is now updated to return Promise<MikaEntityConfig | null>
    const resolvedConfig = await config.getConfig(slug);

    // // 2. Check Entity Existence (Context Isolation)
    if (!resolvedConfig) {
        console.warn(`[MikaGuard] Entity config not found for slug: ${slug}.`);
        return router.createUrlTree(['/not-found']);
    }

    // 3. Check Permissions (Security Enforcement)
	const requiredClaim = config.resolveRequiredClaim(resolvedConfig, EMikaAction.SHOW);

    if (!auth.hasPermission(requiredClaim)) {
        // Logged-in user lacks permission for this specific entity.
        console.warn(`[MikaGuard] User lacks '${requiredClaim}' permission for entity: ${slug}.`);

        // If the user is logged in but unauthorized, send them to the Dashboard (a safer landing page).
        return router.createUrlTree(['/dashboard']);
    }

    // All checks passed. Allow navigation.
    return true;
};
