import { inject, Injectable, signal } from '@angular/core';
import { MikaContentLocalizationSettings, MikaLanguageOption } from '../interfaces/entity/mika-language.interface';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';
import { isEmpty } from '../utils/utils';
import { MikaApiService } from './http/mika-api.service';
import { MikaLocalStorageAdapterService } from './mika-localstorage-adapter.service';
import { MikaAppService } from './mika-app.service';

@Injectable({ providedIn: 'root' })
export class MikaLanguageService {
  translate = inject(TranslateService);

	private default: MikaLanguageOption[] = [
        { title: 'English', locale: 'en', direction: 'ltr', default: false },
        { title: 'العربية', locale: 'ar', direction: 'rtl', default: true }
    ];

	private languagesSignal = signal<MikaLanguageOption[]>(this.default);
	private currentLocaleSignal = signal<string>(this.translate.getDefaultLang() || 'ar');
	private dashLanguage = signal(null);

	formLocaleSignal = signal<string>(this.translate.getDefaultLang() || 'ar');
	tableLocalSignal = signal<string>(this.translate.getDefaultLang() || 'ar');

	constructor(
		private app: MikaAppService,
		private api: MikaApiService,
		private localAdapter: MikaLocalStorageAdapterService
	) {}

	async register(languageConfig: MikaContentLocalizationSettings) {
		console.log('Registering language config:', languageConfig);
		if (!languageConfig || !languageConfig.options?.length) {
			this.setInitialAppLanguage(this.currentLocaleSignal());
			return;
		}

		let options: MikaLanguageOption[] = [];

		if (languageConfig.languageEntityKey) {
			const entityConfig = await this.app.getConfig(languageConfig.languageEntityKey);
			const response: any = this.api.config(entityConfig).get();
			const langs = response.map((item: any) => ({
				title: item.title,
				locale: item.locale,
				direction: item.direction,
				default: item.default,
				order: item.order,
			}));
			options = langs;
		} else if (languageConfig.loadOptions) {
			options = await languageConfig.loadOptions();
		} else {
			options = languageConfig.options;
		}

		// sort if needed
		options = options?.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

		// set the signal
		this.languagesSignal.set(options);

		// update local entity
		await this.localAdapter.set('languages', options);

		// set default locale
		const defaultLang = options?.find(opt => opt.default) ?? options[0];
		if (defaultLang) this.currentLocaleSignal.set(defaultLang.locale || 'ar');

		this.setInitialAppLanguage(this.currentLocaleSignal());
	}

	get languages() {
		return this.languagesSignal();
	}

	get currentLocale() {
		return this.currentLocaleSignal();
	}

	get currentDirection(): 'ltr' | 'rtl' {
		const current = this.languagesSignal().find(l => l.locale === this.currentLocaleSignal());
		return current?.direction ?? 'ltr';
	}

	switchLanguage(locale: string) {
		if (this.languagesSignal().some(l => l.locale === locale)) {
			this.currentLocaleSignal.set(locale);
		}
	}

	setFormDefaultLocale() {
		this.formLocaleSignal.set(this.translate.getDefaultLang() || 'ar');
	}

	setTableDefaultLocale() {
		this.tableLocalSignal.set(this.translate.getDefaultLang() || 'ar');
	}

	// dashboard

	getDashboardDefaultLang() {
		return this.languages.find((item: any) => item.locale === (this.translate.getDefaultLang() || 'ar'))
	}

   async setInitialAppLanguage(locale?: string) {
		if (locale) {
			const lang = this.languages.find((item: any) => item.locale === locale);
			await this.setDashboardLanguage(lang);
			return;
		}

		const storedDefaultLang = (await Preferences.get({ key: 'dashboardLang' })).value;
		const selected = storedDefaultLang && !isEmpty(storedDefaultLang) ? JSON.parse(storedDefaultLang) : this.getDashboardDefaultLang();
        await this.setDashboardLanguage(selected);
    }

    async setDashboardLanguage(language: any) {
		this.dashLanguage.set(language);

		await Preferences.set({
			key: 'dashboardLang',
			value: JSON.stringify(this.dashLanguage())
		});

		this.setTranslateServieConfig();

        this.updateHtmlAttributes();
    }

	getDashboardLanguage() {
        return this.dashLanguage();
    }

	setTranslateServieConfig() {
		const lang: any = this.dashLanguage();
		this.translate.setDefaultLang(lang?.locale);
        this.translate.use(lang.locale);
	}

	updateHtmlAttributes() {
		const lang: any = this.dashLanguage();
		document.documentElement.lang = lang.locale;
        document.documentElement.dir = lang.direction;
        document.documentElement.classList.add(`${lang.locale}-font`);
	}

	setRTL() {
		const selected = this.languages.find((item: any) => item.direction === 'rtl');
		this.setDashboardLanguage(selected);
	}
}
