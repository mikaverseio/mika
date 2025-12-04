import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    show = true;
    selected: any = {};
    langs = [
        { name: 'English', locale: 'en', direction: 'ltr' },
        { name: 'العربية', locale: 'ar', direction: 'rtl' }
    ];

    constructor(private translate: TranslateService) {
		const fromStorage: any = localStorage.getItem('defaultLang');
        this.selected = localStorage.getItem('defaultLang') ? JSON.parse(fromStorage) : this.langs.find((item: any) => item.locale === (this.translate.getDefaultLang() || 'ar'));
    }

    setInitialAppLanguage() {
        this.setLanguage(this.selected);
    }

    getSelected() {
        return this.selected;
    }

    getLanguages() {
        return this.langs;
    }

    setLanguage(language: any) {
        localStorage.setItem('defaultLang', JSON.stringify(language));
        this.translate.setDefaultLang(language.locale);
        this.translate.use(language.locale);
        this.selected = language;
        document.documentElement.dir = this.selected.direction;
        document.documentElement.lang = this.selected.locale;
    }

    resetShow() {
        this.show = false;
        setTimeout(() => {
            this.show = true;
        }, 10);
    }
}
