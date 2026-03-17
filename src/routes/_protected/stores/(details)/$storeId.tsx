import { createFileRoute, redirect } from '@tanstack/react-router';
import { hasPermission } from '@/lib/utils/has-permission.ts';
import * as z from 'zod';
import { stores_get_byId_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import type { IBreadcrumb } from '@/components/layout/nav-breadcrumb.tsx';
import { getLocale, type Locale } from '@/paraglide/runtime';
import { EditStoreCard } from '@/routes/_protected/stores/(details)/-components/edit-store';


const paramsSchema = z.object({
  storeId: z.coerce.number().int().positive()
});

const locale = getLocale();
const titleTranslations: Record<Locale, string> = {
  en: 'Store details',
  ro: 'Detalii magazin',
  ru: 'Детали магазина'
};
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/stores/(details)/$storeId')({
  component: RouteComponent,
  params: { parse: (params) => paramsSchema.parse(params) },
  staticData: {
    crumbs: { title: title }
  },
  beforeLoad: ({ context: { permissions } }) => {
    const can = hasPermission(permissions, 'stores', 'get');
    if (can)
      return;

    throw redirect({ to: '/' });
  },
  loader: async ({ context: { queryClient }, params: { storeId } }) => {
    const store = await (queryClient.ensureQueryData(stores_get_byId_QueryOptions({ path: { id: storeId } })).catch(() => undefined));
    const crumb: IBreadcrumb = { title: store?.name ?? title };
    return { crumbs: crumb, store: store };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.store?.name ?? title }]
  })
});

function RouteComponent() {
  const { storeId } = Route.useParams();

  return (
    <main className="space-y-4">
      <EditStoreCard storeId={storeId} hideHeader/>
    </main>
  );
}
