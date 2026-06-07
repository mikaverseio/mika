import { MikaFieldConfig } from "./mika-field-config.interface";

export interface MikaFilterConfig extends MikaFieldConfig {
    /**
     * Key to use for localization
     */
    localizeKey?: string;
}
