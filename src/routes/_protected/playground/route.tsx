import { createFileRoute } from '@tanstack/react-router'
import { getLocale, type Locale } from '@/paraglide/runtime';


const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Playground', ro: 'Joacă', ru: 'Песочница' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/playground')({
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

