import { LocalizationStrategy } from "../../types/mika-app.type";

/**
 * Represents a language option in the MikaForm.
 * Each language option includes a title, locale code, and text direction.
*/
export interface MikaLanguageOption {

    title: string;

    locale: string;

    direction: 'rtl' | 'ltr';

    default?: boolean;

    order?: number;
}

/**
 * Configuration for language settings in the MikaForm.
 * This interface allows you to define the available languages,
 * their display titles, and how they should be structured in
 * the API response.
 */
export interface MikaLocalizationConfig {

    options: MikaLanguageOption[],

    languageEntityKey?: string

    optionSource?: string,

    strategy?: LocalizationStrategy;

    nestedStrategyKey?: string;

    current?: string;

    loadOptions?: () => any;

    resolve?: (item: any, key: string, locale: string) => any;
}
