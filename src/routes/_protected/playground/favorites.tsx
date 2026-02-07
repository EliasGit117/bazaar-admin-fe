import { createFileRoute } from '@tanstack/react-router'
import { getLocale, type Locale } from '@/paraglide/runtime';


const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Favorites', ro: 'Favorite', ru: 'Избранное' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/playground/favorites')({
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/starred"!</div>
}
