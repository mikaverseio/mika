const arabicMap: Record<string, string> = {
	'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa',
	'ب': 'b', 'ت': 't', 'ث': 'th',
	'ج': 'j', 'ح': 'h', 'خ': 'kh',
	'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
	'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
	'ط': 't', 'ظ': 'z', 'ع': 'aa', 'غ': 'gh',
	'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
	'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
	'ي': 'y', 'ى': 'a', 'ئ': 'y', 'ء': '', 'ة': 'h'
};

/**
 * Check if a string is a valid URL.
 * Uses a regular expression to validate the URL.
 * @param value The string to check.
 * @returns True if the string is a valid URL, false otherwise.
 */
export function isUrl(value: string): boolean {
	const reg = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
	return reg.test(value) ? true : false;
}

/**
 * Deep clone an object or array.
 * Uses structuredClone if available, otherwise falls back to JSON serialization.
 * @param obj The object or array to clone.
 * @returns A deep copy of the input object or array.
 */
export function cloneDeep<T>(obj: T): T {
	// Use structuredClone if available for better support
	if (typeof structuredClone === 'function') {
		return structuredClone(obj);
	}
	// Fallback to JSON.parse/stringify for deep cloning
	return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if a value is empty.
 * Works for null, undefined, strings, arrays, and objects.
 * @param value The value to check.
 * @returns True if the value is empty, false otherwise.
 */
export function isEmpty(value: any): boolean {
	if (value == null) return true; // Checks for null or undefined
	if (typeof value === 'string' || Array.isArray(value)) return value.length === 0; // Checks for empty string or array
	if (typeof value === 'object') return Object.keys(value).length === 0; // Checks for empty object
	return false; // Other types are not considered empty
};


/**
 * Remove falsy values (null, undefined, false, 0, '', NaN) and return unique values.
 * Equivalent to _.compact and _.uniq from Lodash.
 * @param values Array of values to filter and deduplicate.
 * @returns A new array with unique and non-falsy values.
 */
export function uniqueAndCompact<T>(values: (T | null | undefined | false | '' | 0)[]): T[] {
	return Array.from(new Set(values.filter(Boolean) as T[]));
};

export function getTargetUrl(type: string, userId: string, profileId: string) {
	const url = type === 'personal' ? '/view-personal-profile/' + userId : '/view-item/' + profileId;
	return url;
}

export function hashStringToNumber(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash); // Ensure it's positive
}

export function uuid() {
	let dt = new Date().getTime();
	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}


export function unionBy(array: any[], key: string): any[] {
	const seen = new Map(); // Use a Map to track unique items by the key
	array.forEach(item => {
		if (!seen.has(item[key])) {
			seen.set(item[key], item); // Add unique items to the Map
		}
	});
	return Array.from(seen.values()); // Return the values as an array
}


export function printHtml(html: string, config: any = null) {
	const printContents = html;
	const popupWin = window.open(
		'',
		'_blank',
		'toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1,' +
		'top=0,left=0,width=' + screen.width + ',height=' + screen.height
	);
	popupWin?.document.open();
	popupWin?.document.write(`
		  <html>
			<head>
			  <title>Print Preview</title>
			  <link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
			  <style>
				body {
					font-family: 'Tajawal', sans-serif;
					margin: 20px;
				}

				h1, h2 h3, p {
					font-family: 'Tajawal', sans-serif;
				}

				@page
				{
					size: auto;
					margin: 2mm 2mm 2mm 2mm;
				}
			  </style>
			</head>
			<body onload="window.print(); window.close();">${printContents}</body>
		  </html>
		`);
	popupWin?.document.close();
}


export function slugify(text: string): string {
	return text
		.split('')
		.map(char => {
			if (arabicMap[char]) return arabicMap[char];
			return char;
		})
		.join('')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
		.replace(/\s+/g, '-')        // Replace spaces with -
		.replace(/-+/g, '-');        // Collapse dashes
}

export function convertToFormData(data: any, localizable: boolean = false): FormData | any {
	const formTranslations = localizable ? [...data.formTranslations] : [];
	delete data?.formTranslations;
	const files = formTranslations.filter((item: any) => item.type == 'file');
	const translations = formTranslations.filter((item: any) => item.type != 'file');
	files.map((item: any) => { delete data[item.column_name]; });
	const containsFile = Object.values(data).some(v => v instanceof File);

	if (!containsFile && !files?.length) return { ...data, formTranslations };

	const formData = new FormData();
	for (const key in data) {
		const value = data[key];
		formData.append(key, value ?? '');
	}
	for (const item of files) {
		formData.append(`${item.column_name}[${item.locale}]`, item.value);
	}
	if (localizable && translations?.length) {
		formData.append('formTranslations', JSON.stringify(translations));
	}
	return formData;
}

// 1. Robust Type Checker
function isObject(item: any): boolean {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

// 2. Fixed Merge Function
export function deepMerge(target: any, source: any): any {
	// If target is undefined/null, default to empty object to prevent crashes
	const output = Object.assign({}, target || {});

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach(key => {
			const sourceValue = source[key];
			const targetValue = target[key];

			// CRITICAL FIX: Only recurse if BOTH are objects
			if (isObject(targetValue) && isObject(sourceValue)) {
				output[key] = deepMerge(targetValue, sourceValue);
			} else {
				// Otherwise, simply overwrite (Source wins)
				Object.assign(output, { [key]: sourceValue });
			}
		});
	}

	return output;
}
