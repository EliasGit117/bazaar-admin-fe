import { createFileRoute } from '@tanstack/react-router'
import { getLocale, type Locale } from '@/paraglide/runtime';


const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'History', ro: 'Istorie', ru: 'История' };
const title = titleTranslations[locale];


export const Route = createFileRoute('/_protected/playground/history')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/history"!</div>
}
