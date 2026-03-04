import {
  type ComponentProps,
  type FC,
  useEffect,
  useState
} from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  XCircleIcon
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command.tsx';
import { cn, normalizeError } from '@/lib/utils';
import {
  keepPreviousData,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  vendors_get_byId_QueryKeys,
  vendors_get_byId_QueryOptions,
  vendors_post_search_QueryOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import type {
  VendorDto,
  PostVendorsSearchData
} from '@/api/generated';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { useDebounce } from 'use-debounce';
import { m } from '@/paraglide/messages';
import { getLocale, type Locale } from '@/paraglide/runtime';
import { Badge } from '../ui/badge';



type TValue = number | undefined;
type TVendor = VendorDto | undefined;

const translations: Record<string, Record<Locale, string>> = {
  title: {
    en: 'Select vendor',
    ro: 'Selectează vendor',
    ru: 'Выбрать вендора'
  },
  vendor_with_id: {
    en: 'Vendor with id',
    ro: 'Vendor cu id',
    ru: 'Вендор с id'
  }
};


interface IProps
  extends Omit<ComponentProps<typeof Button>, 'asChild' | 'value'> {
  placeholder?: string;
  value?: number | undefined;
  align?: 'start' | 'center' | 'end';
  onValueChange?: (value: TValue, vendor: TVendor) => void;
  isItemDisabled?: (vendor: VendorDto) => boolean;
  prefetch?: boolean;
  searchFilter?: Omit<PostVendorsSearchData['body'], 'page' | 'limit'>;
}

const pageLimit = 8;

export const VendorSelectDropdown: FC<IProps> = (props) => {
  const {
    className,
    prefetch,
    value,
    onValueChange,
    searchFilter,
    isItemDisabled,
    placeholder,
    align,
    ...btnProps
  } = props;

  const queryClient = useQueryClient();
  const locale = getLocale();

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] =
    useState<TValue>();
  const [name, setName] = useState('');

  const [debouncedName] = useDebounce(name, 300);

  const isControlled = value !== undefined || onValueChange !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const handleChange = (newValue: TValue, vendor: TVendor) => {
    if (!isControlled) setInternalValue(newValue);
    onValueChange?.(newValue, vendor);
  };

  const { data: findVendorData, isPending: isPendingVendor } =
    useQuery({
      ...vendors_get_byId_QueryOptions({ path: { id: selectedValue! } }),
      placeholderData: keepPreviousData,
      enabled: selectedValue != null
    });

  const { data: searchResult, isPending: isPendingSearch, error: searchError } = useQuery({
    ...vendors_post_search_QueryOptions({
      body: {
        ...searchFilter,
        page: page,
        limit: pageLimit,
        name: debouncedName || undefined
      }
    }),
    placeholderData: keepPreviousData,
    enabled: Boolean(open || prefetch)
  });

  const onSelect = (val: TValue, vendor: TVendor) => {
    handleChange(val, vendor);
    setOpen(false);

    if (val && vendor)
      queryClient.setQueryData(vendors_get_byId_QueryKeys({ path: { id: val } }), vendor);
  };

  useEffect(() => {
    if (!searchError)
      return;

    const { name, message } = normalizeError(searchError);
    toast.error(name, { description: message });
  }, [searchError]);

  useEffect(() => {
    setPage(1);
  }, [debouncedName]);

  useEffect(() => {
    if (open)
      return;

    setPage(1);
    setName('');
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('font-normal text-base md:text-sm', !selectedValue && 'text-muted-foreground', className)}
          {...btnProps}
        >
          <div className="flex items-center w-full min-w-0">
            {selectedValue ? (
              findVendorData ? (
                <span className="truncate flex-1 text-left">
                  {findVendorData.name}
                </span>
              ) : isPendingVendor ? (
                <Skeleton className="h-4 m w-full"/>
              ) : (
                <span className="truncate flex-1 text-left">
                  {translations.user_with_id[locale]}: {selectedValue}
                </span>
              )
            ) : (
              <span className="truncate flex-1 text-left">
                {placeholder ?? translations.title[locale]}
              </span>
            )}

            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-(--radix-popover-trigger-width) w-fit p-0 gap-1" align={align}>
        <div className="px-1 mt-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 text-sm shadow-none rounded-sm"
            placeholder={m['common.name']()}
          />
        </div>

        <Command>
          <CommandList>
            {!isPendingSearch && <CommandEmpty>{m['common.no_results_found']()}</CommandEmpty>}

            <CommandGroup className="p-0">
              {!isPendingSearch ?
                searchResult?.items.map((vendor) => {
                  return (
                    <CommandItem
                      key={vendor.id}
                      value={`${vendor.id}`}
                      data-checked={selectedValue === vendor.id}
                      onSelect={() => onSelect(vendor.id, vendor)}
                      disabled={isItemDisabled?.(vendor) ?? false}
                    >
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="bg-muted rounded-sm h-7 gap-1.5">
                          <span className='text-[0.625rem] text-muted-foreground'>
                            {vendor.id}
                          </span>
                          <Separator orientation='vertical' className='my-0.5'/>
                          <span>{vendor.name}</span>
                        </Badge>

                        <Separator orientation='vertical' className='my-1'/>

                        <div className="flex flex-col flex-1">
                          <span className="text-[0.625rem]">
                            {vendor.owner.firstName} {vendor.owner.lastName}
                          </span>

                          <span className="text-[0.625rem] text-muted-foreground">
                            {vendor.owner.email}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })
                : (
                  <Skeleton className="rounded-sm w-74" style={{ height: 32 * pageLimit }}/>
                )}
            </CommandGroup>
          </CommandList>
        </Command>

        <div className="flex gap-1 items-center p-1 mx-auto">
          <Button
            variant="secondary"
            size="icon-sm"
            disabled={!searchResult || isPendingSearch || page === 1}
            onClick={() => setPage(1)}
          >
            <ChevronsLeftIcon/>
          </Button>

          <Button
            variant="secondary"
            size="icon-sm"
            disabled={!searchResult || !searchResult.hasPrevPage || isPendingSearch}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeftIcon/>
          </Button>

          <div className="border rounded-md p-2 size-8 flex justify-center items-center">
            <span>
              {searchResult?.page ?? 1}
            </span>
          </div>

          <Button
            size="icon-sm"
            variant="secondary"
            disabled={
              !searchResult ||
              !searchResult.hasNextPage ||
              isPendingSearch
            }
            onClick={() =>
              setPage((p) => p + 1)
            }
          >
            <ChevronRightIcon/>
          </Button>

          <Button
            size="icon-sm"
            variant="secondary"
            disabled={
              !searchResult ||
              isPendingSearch ||
              page === searchResult.totalPages
            }
            onClick={() =>
              setPage(
                searchResult?.totalPages ?? 1
              )
            }
          >
            <ChevronsRightIcon/>
          </Button>
        </div>

        {selectedValue && (
          <div className="p-1 pt-0 space-y-1">
            <Separator/>
            <Button
              size="sm"
              variant="ghost"
              className="w-full"
              onClick={() =>
                onSelect(undefined, undefined)
              }
            >
              <XCircleIcon/>
              <span>{m['common.clear']()}</span>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};