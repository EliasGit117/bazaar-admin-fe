import { type FC, useEffect } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useStoreSheet, StoreSheetMode } from './provider.tsx';
import {
  createStoreSchema,
  updateStoreSchema,
  type TCreateStore,
  type TUpdateStore
} from './schemas.tsx';
import { StoreForm } from './form.tsx';
import {
  stores_get_byId_QueryOptions,
  stores_patch_byId_MutationOptions,
  stores_post_index_MutationOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import { type StoreDto, StoreStatus } from '@/api/generated';
import { m } from '@/paraglide/messages';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FilePlusCornerIcon, SaveIcon, XIcon } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { normalizeError } from '@/lib/utils';
import { toast } from 'sonner';


interface IProps {
  onSuccess?: () => void;
}

export const StoreSheet: FC<IProps> = ({ onSuccess }) => {
  const { isOpen, options, close } = useStoreSheet();
  const mode = options?.mode;
  const storeId: number = (options?.mode === StoreSheetMode.Update ? options.storeId : null) ?? -1;

  const form = useForm<TCreateStore | TUpdateStore>({
    resolver: zodResolver(mode === StoreSheetMode.Create ? createStoreSchema : updateStoreSchema),
    defaultValues: getFormValues()
  });

  const { data: store, isLoading: isLoadingStore } = useQuery({
    ...stores_get_byId_QueryOptions({ path: { id: storeId } }),
    enabled: mode === StoreSheetMode.Update && storeId > 0,
    staleTime: 0,
    gcTime: 0
  });

  const onMutationSuccess = () => {
    onSuccess?.();
    close();
  };

  const onMutationError = (error: unknown) => {
    const { name, message } = normalizeError(error);
    toast.error(name, { description: message });
  };

  const { mutate: create, isPending: isCreating } = useMutation({
    ...stores_post_index_MutationOptions(),
    onSuccess: onMutationSuccess,
    onError: onMutationError
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    ...stores_patch_byId_MutationOptions(),
    onSuccess: onMutationSuccess,
    onError: onMutationError
  });

  const onSubmit = (values: TCreateStore | TUpdateStore) => {
    if (mode === StoreSheetMode.Create) {
      create({ body: values as TCreateStore });
      return;
    }

    if (storeId < 1)
      return;

    update({ path: { id: storeId }, body: values });
  };

  const onOpenChange = (v: boolean) => {
    if (isCreating || isUpdating || v)
      return;

    close();
  };

  useEffect(() => {
    if (!isOpen)
      return;

    if (mode === StoreSheetMode.Create || store == null) {
      form.reset(getFormValues());
      return;
    }

    form.reset(getFormValues(store));
  }, [isOpen, mode, store]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full! max-w-full! sm:max-w-full! md:max-w-2xl! gap-0 border-l-0! md:border-l!"
        showCloseButton={false}
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            {mode === StoreSheetMode.Update
              ? m['pages.stores.list.sheet.edit_store_title']()
              : m['pages.stores.list.sheet.create_store_title']()
            }
          </SheetTitle>

          <SheetDescription>
            {mode === StoreSheetMode.Update
              ? m['pages.stores.list.sheet.edit_store_description']()
              : m['pages.stores.list.sheet.create_store_description']()
            }
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto mr-2 my-2" type="always">
          <StoreForm
            id="store-form"
            form={form as ReturnType<typeof useForm<TCreateStore>>}
            className="px-4 py-1"
            disabled={isCreating || isUpdating}
            loading={isLoadingStore}
            onSubmit={onSubmit}
          />
        </ScrollArea>

        <SheetFooter className="flex flex-col sm:flex-row gap-4 justify-between items-end pt-0">
          <div className="flex flex-row sm:justify-end gap-2 w-full">
            <SheetClose className="grow sm:grow-0 sm:min-w-32" asChild>
              <Button variant="outline" disabled={isCreating || isUpdating}>
                <XIcon/>
                <span>{m['common.close']()}</span>
              </Button>
            </SheetClose>

            <LoadingButton
              form="store-form"
              className="grow sm:min-w-32 sm:grow-0"
              disabled={isLoadingStore}
              loading={isCreating || isUpdating}
            >
              {mode === StoreSheetMode.Update ? <SaveIcon/> : <FilePlusCornerIcon/>}
              <span>{mode === StoreSheetMode.Update ? m['common.save']() : m['common.create']()}</span>
            </LoadingButton>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};


function getFormValues(store?: StoreDto): TCreateStore | TUpdateStore {
  return {
    name: store?.name ?? '',
    slug: store?.slug ?? '',
    status: store?.status ?? StoreStatus.DRAFT,
    vendorId: store?.vendorId ?? undefined!,
    shortDescriptionEn: store?.shortDescriptionEn ?? '',
    shortDescriptionRo: store?.shortDescriptionRo ?? '',
    shortDescriptionRu: store?.shortDescriptionRu ?? '',
    tags: store?.tags ?? []
  };
}