import { type FC, useEffect } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useStoreSheet } from './provider';
import {
  createStoreSchema,
  type TCreateStore
} from './schemas';
import { CreateStoreForm } from './form';
import {
  stores_post_index_MutationOptions
} from '@/api/generated/@tanstack/react-query.gen';
import { StoreStatus } from '@/api/generated';
import { m } from '@/paraglide/messages';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FilePlusCornerIcon, XIcon } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { normalizeError } from '@/lib/utils';
import { toast } from 'sonner';


interface IProps {
  onSuccess?: () => void;
}

export const CreateStoreSheet: FC<IProps> = ({ onSuccess }) => {
  const { isOpen, close } = useStoreSheet();

  const form = useForm<TCreateStore>({
    resolver: zodResolver(createStoreSchema),
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

  const { mutate: create, isPending: isCreating } = useMutation({
    ...stores_post_index_MutationOptions(),
    onSuccess: () => {
      close?.();
      onSuccess?.();
    },
    onError: (error) => {
      const { name, message } = normalizeError(error);
      toast.error(name, { description: message });
    }
  });

  const onSubmit = (values: TCreateStore) => {
    create({ body: values });
    return;
  };

  const onOpenChange = (v: boolean) => {
    if (isCreating || v)
      return;

    close();
  };

  useEffect(() => {
    if (!isOpen)
      return;

    form.reset();
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full! max-w-full! sm:max-w-full! md:max-w-2xl! gap-0 border-l-0! md:border-l!"
        showCloseButton={false}
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            {m['pages.stores.list.sheet.create_store_title']()}
          </SheetTitle>

          <SheetDescription>
            {m['pages.stores.list.sheet.create_store_description']()}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto mr-2 my-2" type="always">
          <CreateStoreForm
            id="user-form"
            form={form}
            className="px-4 py-1"
            disabled={isCreating}
            onSubmit={onSubmit}
          />
        </ScrollArea>

        <SheetFooter className="flex flex-col sm:flex-row gap-4 justify-between items-end pt-0">
          <div className="flex flex-row sm:justify-end gap-2 w-full">
            <SheetClose className="grow sm:grow-0 sm:min-w-32" asChild>
              <Button variant="outline" disabled={isCreating}>
                <XIcon/>
                <span>{m['common.close']()}</span>
              </Button>
            </SheetClose>

            <LoadingButton form="user-form" className="grow sm:min-w-32 sm:grow-0" loading={isCreating}>
              <FilePlusCornerIcon/>
              <span>{m['common.create']()}</span>
            </LoadingButton>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};