import { createFileRoute, redirect } from '@tanstack/react-router';
import { getLocale, type Locale } from '@/paraglide/runtime';
import * as z from 'zod';
import type { ZodType } from 'zod';
import { AdminUserRole, AdminUserStatus, type PostUsersSearchData } from '@/api/generated';
import { users_search_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import { UsersTable } from '@/routes/_protected/users/-components/users-table/table.tsx';
import { dateRangeSchema } from '@/components/data-table/types/schemas.ts';
import { hasPermission } from '@/lib/utils/has-permission.ts';


export const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1),
  limit: z.number().int().min(1).max(100).optional().catch(10),
  dir: z.enum(['asc', 'desc']).optional().catch('desc')
});

const listUsersSchema = paginatedSchema.extend({
  id: z.number().int().min(1).optional().catch(undefined),
  firstName: z.string().optional().catch(undefined),
  lastName: z.string().optional().catch(undefined),
  email: z.string().optional().catch(undefined),
  status: z.array(z.enum(AdminUserStatus)).optional().catch(undefined),
  role: z.array(z.enum(AdminUserRole)).optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined)

}) satisfies ZodType<PostUsersSearchData['body']>;



const locale = getLocale();
const titleTranslations: Record<Locale, string> = {
  en: 'Users',
  ro: 'Utilizatori',
  ru: 'Пользователи'
};

const title = titleTranslations[locale];


export const Route = createFileRoute('/_protected/users/')({
  component: RouteComponent,
  staticData: { crumbs: { title } },
  head: () => ({ meta: [{ title }] }),
  validateSearch: listUsersSchema,
  beforeLoad: ({ context: { permissions } }) => {
    const can = hasPermission(permissions, 'users', 'list');
    if (can)
      return;

    throw redirect({ to: '/' })
  },
  loaderDeps: (deps) => deps,
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    void queryClient.prefetchQuery({
      ...users_search_QueryOptions({ body: search }),
      staleTime: Infinity
    });
  }
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="space-y-4">
      <UsersTable search={search}/>
    </main>
  );
}
