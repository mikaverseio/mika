export interface MikaTableColumn {
	key: string;
	columnDef?: string;
	label: string;
	sortable?: boolean;
	localizable?: boolean;
	localizeField?: string;
	renderType?: 'text' | 'chip' | 'image' | 'date' | 'time' | 'object';
	trueValue?: string;
	falseValue?: string;
	translatable?: boolean;
	format?: string;
	allowDisplayNullOrEmpty?: boolean;
	nullOrEmptyFallback?: string;
  }
