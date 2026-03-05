import { createFileRoute, redirect } from '@tanstack/react-router';
import { hasPermission } from '@/lib/utils/has-permission.ts';
import * as z from 'zod';
import { stores_get_byId_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import type { IBreadcrumb } from '@/components/layout/nav-breadcrumb.tsx';
import { getLocale, type Locale } from '@/paraglide/runtime';
import { normalizeError } from '@/lib/utils';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner.tsx';


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

export const Route = createFileRoute('/_protected/stores/$storeId')({
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
  const { store } = Route.useLoaderData();
  const { storeId } = Route.useParams();

  const { data, isPending, error } = useQuery({
    ...stores_get_byId_QueryOptions({ path: { id: storeId } }),
    initialData: store,
    retry: 2
  });

  useEffect(() => {
    if (error == null)
      return;

    const { name, message } = normalizeError(error);
    toast.error(name, { description: message });
  }, [error]);

  return (
    <main className="space-y-2">
      {isPending ? (
        <div>
          <Spinner/>
        </div>
      ) : (
        !!data && (
          <div>
            <h1 className="text-xl font-semibold">{data.name}</h1>
            <p className="text-sm text-muted-foreground">
              Store ID: {storeId}
            </p>
          </div>
        )
      )}
    </main>
  );
}
