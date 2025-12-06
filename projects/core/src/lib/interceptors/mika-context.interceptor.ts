import { inject } from "@angular/core";
import { MikaConfigService, MikaContextService } from "../services";
import { HttpInterceptorFn } from "@angular/common/http";

export const mikaContextInterceptor: HttpInterceptorFn = (req, next) => {
    const config = inject(MikaConfigService);
	let headers = req.headers;
    // 1. Get the current resolved BASE URL from the reactive service
    // This value automatically switches when the user hits 'setActiveEnvironment'
    const baseUrl = config.activeBaseUrl();
    // 2. Only intercept relative URLs
    if (req.url.startsWith('http')) return next(req);
    // 3. Prepend the Base URL
    const url = `${baseUrl}/${req.url}`.replace(/([^:]\/)\/+/g, '$1');
    const modifiedReq = req.clone({ url, headers });
    return next(modifiedReq);
};
