import { EMikaAction } from "../enum/mika-action.enum";
import { MikaBaseAction } from "../interfaces/action/mika-base-action.interface";
import { MikaEntityConfig } from "../interfaces/entity/mika-entity-config.interface";
import { MikaAppConfig } from "../interfaces/mika-app-config.interface";

export type MikaAppConfigOptions = MikaAppConfig | MikaAppConfig[];

export type MikaAppConfigAsyncOptions =
| MikaAppConfig
| MikaAppConfig[]
| string
| (() => Promise<MikaAppConfig | MikaAppConfig[]>);


export type EntityConfigInput =
	| MikaEntityConfig[]
	| Record<string, Function | MikaEntityConfig>
	| Record<string, Function | Partial<MikaEntityConfig>>
	| Map<string, MikaEntityConfig>


export type MikaActionKey = EMikaAction | string;


export type MikaExecutableAction = MikaBaseAction;

export type LocalizationStrategy =

    'attribute' |

    'flat' |

    'nested' |

    'custom';


export type MikaDesignSystem = 'ionic' | 'material';

export type MikaFieldType = 'text' | 'textarea' | 'richtext' | 'select' | 'multiselect' | 'checkbox' | 'file' | 'image' | 'number'
	| 'date' | 'time' | 'datetime' | 'autocomplete' | 'slug' | 'toggle' | 'email' | 'password' | 'url' | 'tel'
	| 'price' | 'radio' | 'json' | 'location' | 'tags' | 'rating' | 'color' | 'composite' | 'group';


export type MikaFormMode = 'create' | 'edit' | 'view';
