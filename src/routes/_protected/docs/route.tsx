import { createFileRoute } from '@tanstack/react-router'
import { getLocale, type Locale } from '@/paraglide/runtime';

const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Documentation', ro: 'Documentație', ru: 'Документация' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/docs')({
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})
