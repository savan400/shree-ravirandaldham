'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex gap-2">
      <Link href={pathname} locale="en" className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
        English
      </Link>
      <Link href={pathname} locale="hi" className={`px-2 py-1 rounded ${locale === 'hi' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
        Hindi
      </Link>
      <Link href={pathname} locale="gu" className={`px-2 py-1 rounded ${locale === 'gu' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
        Gujarati
      </Link>
    </div>
  );
}
