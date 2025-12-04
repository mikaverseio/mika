export const languageMap: { [key: string]: () => Promise<any> } = {
  'ar': () => import('../assets/i18n/ar.json'),
  'en': () => import('../assets/i18n/en.json')
};
