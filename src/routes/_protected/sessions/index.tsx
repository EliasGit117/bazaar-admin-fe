import { createFileRoute } from '@tanstack/react-router';
import { getLocale, type Locale } from '@/paraglide/runtime';
import type { ZodType } from 'zod';
import * as z from 'zod';
import type { PostSessionsSearchData } from '@/api/generated';
import { SessionsTable } from './-components/sessions-table';
import { sessions_search_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';


export const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1),
  limit: z.number().int().min(1).max(100).optional().catch(10),
  dir: z.enum(['asc', 'desc']).optional().catch('desc')
});


const listSessionsSchema = paginatedSchema.extend({
  status: z.array(z.enum(['active', 'revoked'])).optional().catch(undefined)
}) satisfies ZodType<PostSessionsSearchData['body']>;

const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Sessions', ro: 'Sesiuni', ru: 'Сессии' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/sessions/')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
  validateSearch: listSessionsSchema,
  loaderDeps: (deps) => (deps),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    void queryClient.prefetchQuery({ ...sessions_search_QueryOptions({ body: search }), staleTime: Infinity });
  }
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="space-y-4">
      <SessionsTable search={search}/>
    </main>
  );
}
