import { createFileRoute } from '@tanstack/react-router'
import { getLocale, type Locale } from '@/paraglide/runtime';

const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'General', ro: 'General', ru: 'Общее' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/settings/general')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/settings/general"!</div>
}
