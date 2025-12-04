import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { MikaAuthService } from '../services/auth/mika-auth.service';

@Injectable({
	providedIn: 'root'
})
export class MikaAuthGuard implements CanActivate {
	constructor(
		private auth: MikaAuthService,
		private router: NavController
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		// starter auth guard, enhance later to support
		// mulitenant
		const isLoggedIn = this.auth.isLoggedIn();
		if (isLoggedIn) {
			return true;
		} else {
			this.router.navigateRoot(['/login'], { queryParams: { returnUrl: state.url } });
			return false;
		}
	}
}
