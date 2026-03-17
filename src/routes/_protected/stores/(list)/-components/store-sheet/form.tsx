import { type ComponentProps, type FC } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { type TCreateStore } from './schemas.tsx';
import { m } from '@/paraglide/messages';
import { Textarea } from '@/components/ui/textarea.tsx';
import { VendorSelectDropdown } from '@/components/vendor-select-dropdown';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList
} from '@/components/ui/tags-input.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ChevronsUpDownIcon } from 'lucide-react';
import { AdminUserStatus } from '@/api/generated';
import { StoreStatusIcon } from '@/components/icons/store-status-icon.tsx';


interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TCreateStore>;
  onSubmit: (data: TCreateStore) => void;
  loading?: boolean;
  disabled?: boolean;
}


export const StoreForm: FC<IProps> = ({ id = 'store-form', form, onSubmit, disabled, loading, ...props }) => {

  if (loading)
    return (
      <form id={id} {...props}>
        <LoadingSkeleton/>
      </form>
    );

  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} {...props}>
      <fieldset disabled={disabled}>
        <FieldGroup className="grid grid-cols-6 gap-4">

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-3">
                <FieldLabel>{m['pages.stores.list.sheet.store_name']()}</FieldLabel>
                <Input placeholder="Fancy store name" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />


          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-3">
                <FieldLabel>{m['pages.stores.list.sheet.slug']()}</FieldLabel>
                <Input placeholder="some-slug-for-store" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />


          <Controller
            name="vendorId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-3">
                <FieldLabel>{m['common.vendor']()}</FieldLabel>
                <VendorSelectDropdown value={field.value} onValueChange={field.onChange}/>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field className="col-span-full sm:col-span-3">
                <FieldLabel>{m['common.status']()}</FieldLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <StoreStatusIcon status={field.value} className="text-muted-foreground"/>
                      <span>{m[`common.${field.value}`] ? m[`common.${field.value}`]() : field.value}</span>
                      <ChevronsUpDownIcon className="h-4 w-4 opacity-50 ml-auto"/>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                      {Object.values(AdminUserStatus).map(status => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          <StoreStatusIcon status={status} className="text-muted-foreground"/>
                          <span>{m[`common.${status}`]?.() ?? status}</span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>
            )}
          />

          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>
                  {m['common.tags']()}
                </FieldLabel>

                <TagsInput value={field.value} onValueChange={field.onChange} addOnPaste editable>
                  <TagsInputList>
                    {field.value?.map((trick) => (
                      <TagsInputItem key={trick} value={trick} disabled={disabled}>
                        {trick}
                      </TagsInputItem>
                    ))}
                    <TagsInputInput placeholder={`${m['pages.stores.list.sheet.add_tag']()}...`}/>
                  </TagsInputList>
                </TagsInput>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="shortDescriptionEn"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>{m['pages.stores.list.sheet.short_description']()} EN</FieldLabel>
                <Textarea placeholder="Some short description in english" className="min-h-32" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="shortDescriptionRo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>{m['pages.stores.list.sheet.short_description']()} RO</FieldLabel>
                <Textarea placeholder="O scurtă descriere în engleză" className="min-h-32" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="shortDescriptionRu"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>{m['pages.stores.list.sheet.short_description']()} RU</FieldLabel>
                <Textarea placeholder="Краткое описание на русском" className="min-h-32" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

        </FieldGroup>
      </fieldset>
    </form>
  );
};


const LoadingSkeleton: FC = () => (
  <div className="grid grid-cols-6 gap-4">
    {/* name */}
    <div className="col-span-full sm:col-span-3">
      <Skeleton className="mb-2 h-4 w-24"/>
      <Skeleton className="h-10 w-full"/>
    </div>

    {/* slug */}
    <div className="col-span-full sm:col-span-3">
      <Skeleton className="mb-2 h-4 w-24"/>
      <Skeleton className="h-10 w-full"/>
    </div>

    {/* vendorId */}
    <div className="col-span-full sm:col-span-3">
      <Skeleton className="mb-2 h-4 w-24"/>
      <Skeleton className="h-10 w-full"/>
    </div>

    {/* status */}
    <div className="col-span-full sm:col-span-3">
      <Skeleton className="mb-2 h-4 w-24"/>
      <Skeleton className="h-10 w-full"/>
    </div>

    {/* tags */}
    <div className="col-span-full">
      <Skeleton className="mb-2 h-4 w-16"/>
      <Skeleton className="h-11 w-full"/>
    </div>

    {/* shortDescriptionEn */}
    <div className="col-span-full">
      <Skeleton className="mb-2 h-4 w-40"/>
      <Skeleton className="h-32 w-full"/>
    </div>

    {/* shortDescriptionRo */}
    <div className="col-span-full">
      <Skeleton className="mb-2 h-4 w-40"/>
      <Skeleton className="h-32 w-full"/>
    </div>

    {/* shortDescriptionRu */}
    <div className="col-span-full">
      <Skeleton className="mb-2 h-4 w-40"/>
      <Skeleton className="h-32 w-full"/>
    </div>
  </div>
);