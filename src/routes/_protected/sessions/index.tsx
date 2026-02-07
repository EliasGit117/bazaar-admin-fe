import { createFileRoute } from '@tanstack/react-router';
import { getLocale, type Locale } from '@/paraglide/runtime';
import type { ZodType } from 'zod';
import * as z from 'zod';
import type { GetSessionsData } from '@/api/generated';
import { SessionsTable } from './-components/sessions-table';


export const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1),
  limit: z.number().int().min(1).max(100).optional().catch(10),
  dir: z.enum(['asc', 'desc']).optional()
});

const listSessionsSchema = paginatedSchema.extend({}) satisfies ZodType<GetSessionsData['query']>;

const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Sessions', ro: 'Sesiuni', ru: 'Сессии' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/sessions/')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
  validateSearch: listSessionsSchema,
  loaderDeps: (deps) => (deps),
  // loader: async ({ context: { queryClient }, deps: { search } }) => {
    // void queryClient.prefetchQuery({ ...sessions_index_QueryOptions({ query: search }), staleTime: Infinity });
  // }
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="space-y-4">
      <SessionsTable search={search}/>
    </main>
  );
}
