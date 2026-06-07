import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { MikaAuthService } from "../services";
import { inject } from "@angular/core";

export const mikaAuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

	if (!req.url.startsWith('http') || req.url.includes('/login') || req.url.includes('/register')) {
		return next(req);
	}

	const auth = inject(MikaAuthService);
	const token = auth.token();
	const appId = auth.userApp();

	const isFormData = req.body instanceof FormData;

	let headers = req.headers;

	if (!isFormData) {
		headers = headers.set('Content-Type', 'application/json');
	} else {
		headers = headers.delete('Content-Type');
	}

	if (token) {
		headers = headers.set('Authorization', `Bearer ${token}`);
	}

	if (appId) {
		headers = headers.set('X-Tenant-ID', appId);
	}

	const modifiedReq = req.clone({ headers });

	return next(modifiedReq);
}

export function withMikaInterceptors(custom: HttpInterceptorFn[] = []): HttpInterceptorFn[] {
	return [mikaAuthInterceptor, ...custom];
}
