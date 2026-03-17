import { type ComponentProps, type FC, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { cn, normalizeError } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { stores_get_byId_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import { getLocale } from '@/paraglide/runtime';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { PenIcon, Undo2Icon } from 'lucide-react';
import { m } from '@/paraglide/messages';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type StoreDto, StoreStatus } from '@/api/generated';
import {
  editStoreSchema,
  type TEditStore
} from '@/routes/_protected/stores/(details)/-components/edit-store/schemas.tsx';
import { EditStoreForm } from '@/routes/_protected/stores/(details)/-components/edit-store/form.tsx';


interface IProps extends ComponentProps<typeof Card> {
  storeId: number;
  hideHeader?: boolean;
}

export const EditStoreCard: FC<IProps> = ({ storeId, className, hideHeader, ...props }) => {
  const locale = getLocale();
  const localeCapitalized = capitalizeFirst(locale);

  const { data: store, isPending: isPendingStore, error: storeError } = useQuery({
    ...stores_get_byId_QueryOptions({ path: { id: storeId } })
  });

  const shortDescription: string = store?.[`shortDescription${localeCapitalized}`] ?? '-';
  const isLoading = isPendingStore;

  const form = useForm<TEditStore>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: {
      name: '',
      slug: '',
      vendorId: undefined!,
      status: StoreStatus.DRAFT,
      shortDescriptionEn: '',
      shortDescriptionRo: '',
      shortDescriptionRu: '',
      tags: []
    }
  });

  useEffect(() => {
    if (!storeError)
      return;

    const { name, message } = normalizeError(storeError);
    toast.error(name, { description: message });
  }, [storeError]);

  useEffect(() => {
    if (!store)
      return;

    form.reset(getEditForm(store));
  }, [store, form]);

  if (isPendingStore)
    return (<Skeleton className={cn('min-h-42 w-full h-full', className)}/>);

  return (
    <Card className={cn('shadow-none', className)} {...props}>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>
            {store?.name ?? '-'}
          </CardTitle>

          <CardDescription>
            {shortDescription}
          </CardDescription>
        </CardHeader>
      )}

      <CardContent>
        <EditStoreForm form={form} onSubmit={(v) => console.log(v)}/>
      </CardContent>

      <CardFooter className="gap-2 md:justify-end">
        <Button
          variant="outline"
          type="button"
          className="flex-1 md:flex-none" disabled={isLoading || !form.formState.isDirty || !store}
          onClick={() => form.reset()}
        >
          <Undo2Icon/>
          <span>{m['common.reset']()}</span>
        </Button>

        <Button
          variant="default"
          className="flex-1 md:flex-none"
          disabled={isLoading || !form.formState.isDirty}
        >
          <PenIcon/>
          <span>{m['common.edit']()}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

function capitalizeFirst<T extends string>(value: T): Capitalize<T>;
function capitalizeFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getEditForm(store: StoreDto): TEditStore {

  return {
    name: store.name,
    slug: store.slug,
    status: store.status,
    vendorId: store.vendorId,
    shortDescriptionEn: store.shortDescriptionEn,
    shortDescriptionRo: store.shortDescriptionRo,
    shortDescriptionRu: store.shortDescriptionRu,
    tags: []
  };
}