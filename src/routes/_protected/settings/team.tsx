import { createFileRoute } from '@tanstack/react-router'
import { getLocale, type Locale } from '@/paraglide/runtime';


const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Team', ro: 'Echipa', ru: 'Команда' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/settings/team')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
})

function RouteComponent() {
  return <div>Hello "/_protected/settings/team"!</div>
}
