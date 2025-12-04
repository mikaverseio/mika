import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MikaAuthService } from '../services/auth/mika-auth.service';


@Injectable({
	providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
	constructor(
		private auth: MikaAuthService,
		private router: Router
	) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.auth.userApp() !== this.auth.activeAppId) {
			return this.router.navigateByUrl('/dashboard');

		}
		return true;
	}

}
