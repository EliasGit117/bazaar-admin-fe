import { createFileRoute, redirect } from '@tanstack/react-router';
import { getLocale, type Locale } from '@/paraglide/runtime';
import * as z from 'zod';
import type { ZodType } from 'zod';
import { hasPermission } from '@/lib/utils/has-permission.ts';
import { type PostStoresSearchData, StoreStatus } from '@/api/generated';
import { StoresTable } from '@/routes/_protected/stores/-components/stores-table';
import { dateRangeSchema } from '@/components/data-table';


const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1),
  limit: z.number().int().min(1).max(100).optional().catch(10),
  dir: z.enum(['asc', 'desc']).optional().catch('desc')
});

const listStoresSchema = paginatedSchema.extend({
  id: z.number().int().min(1).optional().catch(undefined),
  vendorId: z.number().int().min(1).optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  status: z.array(z.enum(StoreStatus)).optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined)
}) satisfies ZodType<PostStoresSearchData['body']>;

const locale = getLocale();
const titleTranslations: Record<Locale, string> = {
  en: 'Stores',
  ro: 'Magazine',
  ru: 'Магазины'
};
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/stores/')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
  validateSearch: listStoresSchema,
  beforeLoad: ({ context: { permissions } }) => {
    const can = hasPermission(permissions, 'stores', 'list');
    if (can)
      return;

    throw redirect({ to: '/' });
  }
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="space-y-4">
      <StoresTable search={search}/>
    </main>
  );
}
