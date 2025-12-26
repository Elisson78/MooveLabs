export const locales = ['pt', 'fr'] as const
export type Locale = (typeof locales)[number]
