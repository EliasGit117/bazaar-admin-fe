import { createFileRoute, redirect } from '@tanstack/react-router';
import { getLocale, type Locale } from '@/paraglide/runtime';
import * as z from 'zod';
import type { ZodType } from 'zod';
import { hasPermission } from '@/lib/utils/has-permission';
import { CurrencyCode, type PostVendorsSearchData, VendorType } from '@/api/generated';
import { VendorsTable } from '@/routes/_protected/vendors/-components/vendors-table';
import { dateRangeSchema } from '@/components/data-table';
import { vendors_post_search_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';



export const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1),
  limit: z.number().int().min(1).max(100).optional().catch(10),
  dir: z.enum(['asc', 'desc']).optional().catch('desc')
});

const listVendorsSchema = paginatedSchema.extend({
  id: z.number().int().min(1).optional().catch(undefined),
  ownerId: z.number().int().min(1).optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  idno: z.string().optional().catch(undefined),
  iban: z.string().optional().catch(undefined),
  email: z.string().optional().catch(undefined),
  phone: z.string().optional().catch(undefined),
  type: z.array(z.enum(VendorType)).optional().catch(undefined),
  currency: z.array(z.enum(CurrencyCode)).optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),

}) satisfies ZodType<PostVendorsSearchData['body']>;

const locale = getLocale();

const titleTranslations: Record<Locale, string> = {
  en: 'Vendors',
  ro: 'Vendori',
  ru: 'Вендоры'
};

const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/vendors/')({
  component: RouteComponent,
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
  validateSearch: listVendorsSchema,
  beforeLoad: ({ context: { permissions } }) => {
    const can = hasPermission(permissions, 'vendors', 'list');
    if (can) return;

    throw redirect({ to: '/' });
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: ({ context: { queryClient }, deps: { search } }) => {
    void queryClient.prefetchQuery(vendors_post_search_QueryOptions({ body: search }));
  },
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <main className="space-y-4">
      <VendorsTable search={search}/>
    </main>
  );
}