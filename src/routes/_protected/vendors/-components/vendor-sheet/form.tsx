import { type ComponentProps, type FC, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import type { TCreateVendor, TUpdateVendor } from '@/routes/_protected/vendors/-components/vendor-sheet/schemas.ts';
import { CurrencyCode, VendorType } from '@/api/generated';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { BuildingIcon, CheckIcon, ChevronsUpDownIcon, type LucideIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages';
import { Input } from '@/components/ui/input.tsx';
import {
  DropdownMenu,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { NumberInput } from '@/components/ui/number-input.tsx';


interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TCreateVendor | TUpdateVendor>;
  onSubmit: (data: TCreateVendor | TUpdateVendor) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const VendorForm: FC<IProps> = (props) => {
  const {
    form,
    onSubmit,
    id = 'vendor-form',
    disabled,
    loading,
    ...formProps
  } = props;

  if (loading)
    return (
      <form id={id} {...formProps}>
        <LoadingSkeleton/>
      </form>
    );

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      {...formProps}
    >
      <fieldset disabled={disabled}>
        <FieldGroup className="grid grid-cols-2 gap-4">
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedOption = typeOptions.find(option => option.value === field.value);

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{m['common.type']()}</FieldLabel>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {field.value != null ? (
                          <>
                            {selectedOption != null && <selectedOption.icon className="text-muted-foreground"/>}
                            <span>{selectedOption?.title ?? field.value}</span>
                          </>
                        ) : (
                          <span>{m['pages.vendors.list.sheet.select_type']()}</span>
                        )}
                        <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
                      <DropdownMenuGroup>
                        <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                          {typeOptions.map(({ value, title, icon: Icon }) => (
                            <DropdownMenuRadioItem value={value}>
                              <Icon className="text-muted-foreground"/>
                              <span>{title}</span>
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>
              );
            }}
          />

          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => {
              const [open, setOpen] = useState(false);

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{m['pages.vendors.list.sheet.currency']()}</FieldLabel>

                  <Popover open={open} onOpenChange={setOpen} modal>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {field.value || m['pages.vendors.list.sheet.select_currency']()}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-(--radix-popover-trigger-width) p-0 gap-1">
                      <Command className="space-y-1">
                        <CommandInput
                          placeholder={m['common.search']()}
                          groupClassName="rounded-sm!"
                          wrapperClassName="p-0"
                        />
                        <CommandList>
                          <CommandEmpty>
                            {m['common.no_results_found']()}
                          </CommandEmpty>

                          <CommandGroup className="p-0">
                            {Object.values(CurrencyCode).map((code) => (
                              <CommandItem
                                key={code}
                                value={code}
                                hideCheckIcon
                                onSelect={(currentValue) => {
                                  field.onChange(currentValue, { shouldValidate: true });
                                  setOpen(false);
                                }}
                              >
                                <span>{code}</span>
                                <CheckIcon className={cn('ml-auto h-4 w-4', field.value !== code && 'opacity-0')}/>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
              );
            }}
          />

          <Controller
            name="ownerId"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid} className="col-span-full">
                  <FieldLabel>{m['common.owner']()}</FieldLabel>
                  <NumberInput
                    inputSize="sm"
                    min={1}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="1"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
              );
            }}
          />


          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>{m['pages.vendors.list.sheet.vendor_name']()}</FieldLabel>
                <Input placeholder="Some SRL" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />


          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>{m['common.email']()}</FieldLabel>
                <Input placeholder="example@mail.net" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>{m['common.phone']()}</FieldLabel>
                <Input placeholder="+37378253402" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="bankName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>{m['pages.vendors.list.sheet.bank_name']()}</FieldLabel>
                <Input placeholder="Some bank name" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="bicSwift"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>BIC swift</FieldLabel>
                <Input placeholder="HBUKGB4B" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="iban"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>IBAN</FieldLabel>
                <Input placeholder="MD24 AG00 0725 1000 1310 4101" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="idno"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>IDNO</FieldLabel>
                <Input placeholder="MD-IDNO-1003600136646" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="legalAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>{m['pages.vendors.list.sheet.legal_address']()}</FieldLabel>
                <Input placeholder="Nr.498, 537026, Harghita" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="actualAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                <FieldLabel>{m['pages.vendors.list.sheet.actual_address']()}</FieldLabel>
                <Input placeholder="Strada Traian Mosoiu 74, 400132, Cluj" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />


        </FieldGroup>
      </fieldset>
    </form>
  );
};


const typeOptions: { value: VendorType; title: string; icon: LucideIcon; }[] = [
  { value: VendorType.SRL, title: 'SRL', icon: BuildingIcon },
  { value: VendorType.IP, title: 'IP', icon: UserIcon }
];

const LoadingSkeleton: FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Type */}
      <div>
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Currency */}
      <div>
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Name (full width) */}
      <div className="col-span-full">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Email */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Phone */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Bank Name */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* BIC Swift */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* IBAN */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* IDNO */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Legal Address */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Actual Address */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>
    </div>
  );
};