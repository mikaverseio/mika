/**
 * MikaForm Bootstrap File
 * -----------------------
 * This file is executed when MikaForm is ready (after DI context is available).
 * You can use it to register tenants, preload apps, or trigger any boot-time logic.
 */

import { Injector } from "@angular/core";
import { Mika, MikaAppService } from "@mikaverse/core";
import { makeMikaBlogApp } from "./mika-blog/mika-blog.app";


Mika.ready((injector: Injector) => {
	console.log('🚀 MikaForm is ready - executing mika.bootstrap.ts');
	const mikaApp = injector.get(MikaAppService);

	const blogApp = makeMikaBlogApp();
	// Register an app
	mikaApp.registerApp(blogApp);

	// Activate immediately if you want
	mikaApp.activateApp(blogApp.appId).then(() => {
		console.log('✅ Mynely app registered and activated via mika.bootstrap.ts');
	}).catch((err) => {
		console.log(err);
	});
});
