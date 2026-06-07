/**
 * MikaForm Bootstrap File
 * -----------------------
 * This file is executed when MikaForm is ready (after DI context is available).
 * You can use it to register tenants, preload apps, or trigger any boot-time logic.
 */

import { Injector } from "@angular/core";
import { Mika, MikaContextService } from "@mikaverse/core";
import { makeMikaBlogApp } from "./mika-blog/mika-blog.app";
import { makeMikaStoreApp } from "./mika-store/store.app";


Mika.ready((injector: Injector) => {
	const mikaApp = injector.get(MikaContextService);

	const blogApp = makeMikaStoreApp();
	// Register an app
	mikaApp.registerApp(blogApp);

	// Activate immediately if you want
	mikaApp.activateApp(blogApp.appId).then(() => {
		console.log('Mynely app registered and activated via mika.bootstrap.ts');
	}).catch((err) => {
		console.log(err);
	});
});
