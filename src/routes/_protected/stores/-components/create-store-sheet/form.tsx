import { type ComponentProps, type FC } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type TCreateStore } from './schemas';
import { m } from '@/paraglide/messages';
import { Textarea } from '@/components/ui/textarea.tsx';
import { VendorSelectDropdown } from '@/components/vendor-select-dropdown';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList
} from '@/components/ui/tags-input.tsx';


interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TCreateStore>;
  onSubmit: (data: TCreateStore) => void;
  loading?: boolean;
  disabled?: boolean;
}


export const CreateStoreForm: FC<IProps> = ({ id = 'store-form', form, onSubmit, disabled, ...props }) => {

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
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>{m['pages.stores.list.sheet.slug']()}</FieldLabel>
                <Input placeholder="some-slug-for-store" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>
                  Tags
                </FieldLabel>

                <TagsInput value={field.value} onValueChange={field.onChange} addOnPaste editable>
                  <TagsInputList>
                    {field.value?.map((trick) => (
                      <TagsInputItem key={trick} value={trick}>
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