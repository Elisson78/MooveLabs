import { getDictionary, Locale } from '../dictionaries';
import HomeClient from './HomeClient';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const dict = await getDictionary(locale);

  // Add locale to dict for helper logic in client components if needed
  const dictWithLocale = { ...dict, locale };

  return <HomeClient dict={dictWithLocale} />;
}
