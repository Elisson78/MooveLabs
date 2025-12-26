import 'server-only'
import type { Locale } from './i18n-config'

const dictionaries = {
    pt: () => import('./dictionaries/pt.json').then((module) => module.default),
    fr: () => import('./dictionaries/fr.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
export { locales } from './i18n-config'
export type { Locale } from './i18n-config'
