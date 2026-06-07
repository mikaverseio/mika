import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MikaAuthService } from '../services';
import { MikaContextService } from '../services/engine/mika-context.service';

@Injectable({ providedIn: 'root' })
export class MikaAuthGuard implements CanActivate {
	private auth = inject(MikaAuthService);
	private router = inject(Router);
	private context = inject(MikaContextService);

	canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
		if (this.context.settings()?.noAuth) {
			return true;
		}

		if (this.auth.isLoggedIn()) {
			return true;
		}

		return this.router.createUrlTree(['/auth/login'], {
			queryParams: { returnUrl: state.url }
		});
	}
}
