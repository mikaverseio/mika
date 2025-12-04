import { Mika } from '../helpers/mika-app.helper';

export const localizeNested = (item: any, locale: string, field: string | undefined = 'title', sourceField: string = 'translations') => {
	const fallback = item[field] ?? '';
	if (!item || typeof item !== 'object') return fallback;

	if (Array.isArray(item[sourceField])) {
		const translation = item[sourceField].find(
			(t: any) => t?.column_name === field && t?.locale === locale
		);
		return translation?.link?.trim?.() || translation?.value?.trim?.() || fallback;
	} else if (item[sourceField] && typeof item[sourceField] === 'object') {
		const value = item[sourceField]?.[field];
		return value?.[locale]?.trim?.() || fallback;
	}
	return fallback;
}

export const localize = (
	item: any,
	fieldPath?: string | ((item: any, locale: string) => any),
	customLocale?: string
): any => {
	if (!item) return '';

	const locale: any = customLocale ?? Mika.settings?.languages?.current ?? 'ar';
	const strategy = Mika.settings?.languages?.strategy ?? 'attribute';
	const nestedStrategyKey = Mika.settings?.languages?.nestedStrategyKey || 'translations';

	if (typeof fieldPath === 'function') {
		return fieldPath(item, locale);
	}

	const key: any = fieldPath ?? 'title';

	switch (strategy) {
		case 'attribute': {
			const value = item[key];
			return value && typeof value === 'object' ? value[locale] ?? '' : value;
		}

		case 'flat': {
			return item[`${key}_${locale}`] ?? item[key] ?? '';
		}

		case 'nested': {
			return localizeNested(item, locale, fieldPath, nestedStrategyKey);
		}

		case 'custom': {
			const resolver = Mika.settings.languages?.resolve;
			if (resolver && typeof resolver === 'function') {
				return resolver(item, key, locale);
			}
			return localizeNested(item, locale, key, nestedStrategyKey);
		}

		default:
			return item[key];
	}
}

