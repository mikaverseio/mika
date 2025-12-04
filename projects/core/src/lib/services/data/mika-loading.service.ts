import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MikaLoading {

	isLoading = signal(false);
	message = signal('');
	constructor(

	) { }

	present(message?: string) {
		if (this.isLoading() === true) return;
		if (message) this.message.set(message!);
		this.isLoading.set(true);
	}

	dismiss() {
		if (this.isLoading() === false) return;
		this.isLoading.set(false);
		this.message.set('');
	}

}
