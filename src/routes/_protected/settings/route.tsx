import { createFileRoute } from '@tanstack/react-router'
import { getLocale, type Locale } from '@/paraglide/runtime';


const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Settings', ro: 'Setări', ru: 'Настройки' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/settings')({
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

