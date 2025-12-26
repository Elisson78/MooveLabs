'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale } from '../app/i18n-config';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    const currentLocale = pathname.split('/')[1] as Locale;

    const switchedLocale = (locale: Locale) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    const handleLocaleChange = (newLocale: Locale) => {
        router.push(switchedLocale(newLocale));
    };

    return (
        <div className="flex items-center gap-2 text-sm font-medium">
            <Globe size={16} className="text-gray-400" />
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                {locales.map((locale) => (
                    <button
                        key={locale}
                        onClick={() => handleLocaleChange(locale)}
                        className={`px-3 py-1 rounded-full transition-all ${currentLocale === locale
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {locale.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}
