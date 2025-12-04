// src/app/services/seo.service.ts
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MikaSeoService {
	constructor(private title: Title, private meta: Meta) { }

	updateTitle(newTitle: string) {
		this.title.setTitle(newTitle);
		this.meta.updateTag({ property: 'og:title', content: newTitle });
	}

	updateDescription(description: string) {
		this.meta.updateTag({ name: 'description', content: description });
		this.meta.updateTag({ property: 'og:description', content: description });
	}

	updateKeywords(keywords: string) {
		this.meta.updateTag({ name: 'keywords', content: keywords });
	}

	setMetaTags(config: {
		title?: string;
		description?: string;
		keywords?: string;
		image?: string;
		url?: string;
	}) {
		if (config.title) this.updateTitle(config.title);
		if (config.description) this.updateDescription(config.description);
		if (config.keywords) this.updateKeywords(config.keywords);

		if (config.image) {
			this.meta.updateTag({ property: 'og:image', content: config.image });
		}

		if (config.url) {
			this.meta.updateTag({ property: 'og:url', content: config.url });
		}
	}
}
