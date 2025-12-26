import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './src/app/i18n-config'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return

    // Redirect if there is no locale
    const locale = 'pt' // Default to Portuguese for now, can be improved with Accept-Language header
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|api|.*\\..*).*)',
    ],
}
