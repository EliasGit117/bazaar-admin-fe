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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { m } from '@/paraglide/messages';
import { FilePlusCornerIcon, SaveIcon, XIcon } from 'lucide-react';
import { useVendorSheet, VendorSheetMode } from '@/routes/_protected/vendors/-components/vendor-sheet/provider.tsx';
import {
  createVendorSchema,
  type TCreateVendor,
  type TUpdateVendor,
  updateVendorSchema
} from '@/routes/_protected/vendors/-components/vendor-sheet/schemas.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CurrencyCode, type VendorDto, VendorType } from '@/api/generated';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  vendors_get_byId_QueryOptions,
  vendors_patch_byId_MutationOptions,
  vendors_post_index_MutationOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import { VendorForm } from '@/routes/_protected/vendors/-components/vendor-sheet/form.tsx';
import { normalizeError } from '@/lib/utils';
import { toast } from 'sonner';

interface IProps {
  onSuccess?: () => void;
}

export const VendorSheet: FC<IProps> = ({ onSuccess }) => {
  const { isOpen, options, close } = useVendorSheet();
  const mode = options?.mode;
  const vendorId: number = (options?.mode === VendorSheetMode.Create ? null : options?.vendorId) ?? -1;

  const form = useForm<TCreateVendor | TUpdateVendor>({
    resolver: zodResolver(mode === VendorSheetMode.Create ? createVendorSchema : updateVendorSchema),
    defaultValues: getFormValues()
  });

  const { data: vendor, isLoading: isLoadingVendor } = useQuery({
    ...vendors_get_byId_QueryOptions({ path: { id: vendorId } }),
    enabled: (mode === VendorSheetMode.Update && options?.vendorId != null),
    staleTime: 0,
    gcTime: 0
  });

  const onMutationSuccess = () => {
    onSuccess?.();
    close();
  }

  const onMutationError = (error: unknown) => {
    const { name, message } = normalizeError(error);
    toast.error(name, { description: message });
  }

  const { mutate: create, isPending: isCreating } = useMutation({
    ...vendors_post_index_MutationOptions({}),
    onSuccess: onMutationSuccess,
    onError: onMutationError
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    ...vendors_patch_byId_MutationOptions(),
    onSuccess: onMutationSuccess,
    onError: onMutationError
  });

  const onOpenChange = (v: boolean) => {
    if (isCreating || isUpdating || v)
      return;

    close();
  };

  const onSubmit = (values: TCreateVendor | TUpdateVendor) => {
    if (mode === VendorSheetMode.Create) {
      create({ body: values });
      return;
    }

    if (vendorId < 1)
      return;

    update({ path: { id: vendorId }, body: values });
  };

  useEffect(() => {
    if (!isOpen)
      return;

    if (mode === VendorSheetMode.Create || vendor == null) {
      form.reset(getFormValues());
      return;
    }

    form.reset(getFormValues(vendor));
  }, [isOpen, mode, vendor]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full! max-w-full! sm:max-w-full! md:max-w-2xl! gap-0 border-l-0! md:border-l!"
        showCloseButton={false}
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            <span>
              {mode === VendorSheetMode.Update ? (
                m['pages.vendors.list.sheet.edit_vendor_title']()
              ) : (
                m['pages.vendors.list.sheet.create_vendor_title']()
              )}
            </span>
          </SheetTitle>
          <SheetDescription>
            {mode === VendorSheetMode.Update ? (
              m['pages.vendors.list.sheet.edit_vendor_description']()
            ) : (
              m['pages.vendors.list.sheet.create_vendor_description']()
            )}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto mr-2 my-2" type='always'>
          <VendorForm
            id='vendor-form'
            form={form}
            className="px-4 py-1"
            loading={isLoadingVendor}
            disabled={isCreating || isUpdating}
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
              form="vendor-form"
              className="grow sm:min-w-32 sm:grow-0"
              disabled={isLoadingVendor}
              loading={isCreating || isUpdating}
            >
              {mode === VendorSheetMode.Create ? <FilePlusCornerIcon/> : <SaveIcon/>}
              <span>{mode === VendorSheetMode.Create ? m['common.create']() : m['common.save']()}</span>
            </LoadingButton>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};


function getFormValues(vendor?: VendorDto): TCreateVendor | TUpdateVendor {

  return {
    ownerId: vendor?.ownerId ?? undefined!,
    type: vendor?.type ?? VendorType.SRL,
    currency: vendor?.currency ?? CurrencyCode.MDL,
    actualAddress: vendor?.actualAddress ?? '',
    bankName: vendor?.type ?? '',
    bicSwift: vendor?.bicSwift ?? '',
    email: vendor?.email ?? '',
    iban: vendor?.iban ?? '',
    idno: vendor?.idno ?? '',
    legalAddress: vendor?.legalAddress ?? '',
    phone: vendor?.phone ?? '',
    name: vendor?.name ?? ''
  };
}