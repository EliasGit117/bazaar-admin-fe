import { type ComponentProps, type FC, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  UserStarIcon,
  XCircleIcon,
  UserIcon
} from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command.tsx';
import { cn, normalizeError } from '@/lib/utils';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  users_get_byId_QueryKeys,
  users_get_byId_QueryOptions,
  users_post_search_QueryOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import type { AdminUserDto, PostUsersSearchData } from '@/api/generated';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { m } from '@/paraglide/messages';
import { toast } from 'sonner';
import { getLocale, type Locale } from '@/paraglide/runtime';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useDebounce } from 'use-debounce';


type TValue = number | undefined;
type TUser = AdminUserDto | undefined;

const translations: Record<string, Record<Locale, string>> = {
  title: {
    en: 'Select user',
    ro: 'Selectează utilizator',
    ru: 'Выбрать пользователя'
  },
  user_with_id: {
    en: 'User with id',
    ro: 'Utilizator cu id',
    ru: 'Пользователь с id'
  }
};

interface IProps extends Omit<ComponentProps<typeof Button>, 'asChild' | 'value'> {
  placeholder?: string;
  value?: number | undefined;
  previewMode?: 'default' | 'short';
  align?: 'start' | 'center' | 'end';
  onValueChange?: (value: TValue, user: TUser) => void;
  isItemDisabled?: (user: AdminUserDto) => boolean;
  prefetch?: boolean;
  searchFilter?: Omit<PostUsersSearchData['body'], 'page' | 'limit'>;
}

const pageLimit = 8;

export const UserSelectDropdown: FC<IProps> = (props) => {
  const {
    className,
    prefetch,
    value,
    onValueChange,
    searchFilter,
    isItemDisabled,
    placeholder,
    align,
    previewMode = 'default',
    ...btnProps
  } = props;

  const queryClient = useQueryClient();
  const locale = getLocale();

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<TValue>();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const [debouncedFirstName] = useDebounce(firstName, 256);
  const [debouncedLastName] = useDebounce(lastName, 256);

  const isControlled = value !== undefined || onValueChange !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const handleChange = (newValue: TValue, user: TUser) => {
    if (!isControlled)
      setInternalValue(newValue);

    onValueChange?.(newValue, user);
  };

  const { data: findUserData, isPending: isPendingUser } = useQuery({
    ...users_get_byId_QueryOptions({ path: { id: selectedValue! } }),
    placeholderData: keepPreviousData,
    enabled: selectedValue != null,
    staleTime: 0,
    gcTime: 0
  });

  const { data: searchResult, isPending: isPendingSearch, error: searchError } = useQuery({
    ...users_post_search_QueryOptions({
      body: {
        ...searchFilter,
        page: page,
        limit: pageLimit,
        firstName: debouncedFirstName || undefined,
        lastName: debouncedLastName || undefined
      }
    }),
    placeholderData: keepPreviousData,
    enabled: open || prefetch,
    staleTime: 0,
    gcTime: 0
  });

  const onSelect = (value: TValue, user: TUser) => {
    handleChange(value, user);
    setOpen(false);
    queryClient.setQueryData(users_get_byId_QueryKeys({ path: { id: selectedValue! } }), user!);
  };

  useEffect(() => {
    if (!searchError)
      return;

    const { name, message } = normalizeError(searchError);
    toast.error(name, { description: message });
  }, [searchError]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFirstName, debouncedLastName]);

  useEffect(() => {
    if (open)
      return;

    setPage(1);
    setFirstName('');
    setLastName('');
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('font-normal w-full', !selectedValue && 'text-muted-foreground', className)}
          {...btnProps}
        >
          <div className="flex items-center w-full min-w-0">
            {!!selectedValue ? (
              !!findUserData ? (
                <span className="truncate min-w-0 flex-1 text-left">
                  {findUserData.id}. {findUserData.firstName}{' '}
                  {findUserData.lastName}{' '}
                  {previewMode === 'default' && (
                    <span className="capitalize text-muted-foreground text-xs">
                      ({!!m[`roles.${findUserData.role}`] ? m[`roles.${findUserData.role}`]() : findUserData.role})
                    </span>
                  )}
                </span>
              ) : isPendingUser ? (
                <div className="flex gap-2 items-center w-full">
                  <Skeleton className="h-3.5 w-full max-w-4"/>
                  <Skeleton className="h-3.5 w-full max-w-16"/>
                  <Skeleton className="h-3.5 w-full max-w-12"/>
                  <Skeleton className="h-3.5 w-full max-w-10"/>
                </div>
              ) : (
                <span className="truncate flex-1 text-left">
                  {translations.user_with_id[locale]}: {selectedValue}
                </span>
              )
            ) : (
              <>
                <span className="truncate flex-1 text-left">
                  {placeholder ?? translations.title[locale]}
                </span>
              </>
            )}

            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-(--radix-popover-trigger-width) p-0 gap-1" align={align}>
        <div className="flex gap-1 px-1 mt-1">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-8 text-sm shadow-none rounded-sm"
            placeholder={m['common.first_name']()}
          />

          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-8 text-sm shadow-none rounded-sm"
            placeholder={m['common.last_name']()}
          />
        </div>

        <Command className="space-y-1">
          <CommandList>
            <CommandGroup className="p-0">
              {!isPendingSearch ? searchResult?.items.map(user => {
                const translatedRole = m[`roles.${user.role}`] ? m[`roles.${user.role}`]() : user.role;

                return (
                  <CommandItem
                    key={user.id}
                    value={`${user.id}`}
                    data-checked={selectedValue === user.id}
                    onSelect={() => onSelect(user.id, user)}
                    disabled={isItemDisabled?.(user) ?? false}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="parent">
                        <Avatar className="size-7">
                          <AvatarFallback className="text-xs!">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>

                          <Badge
                            variant="outline"
                            className={cn(
                              'h-3 w-fit px-1! text-muted-foreground',
                              'text-[0.5rem] absolute -bottom-1 z-10 bg-background transform left-1/2 -translate-x-1/2'
                            )}
                          >
                            id: {user.id}
                          </Badge>
                        </Avatar>
                      </div>

                      <div className="flex flex-col flex-1">
                        <div className="flex gap-2 items-center">
                          <span className="text-xs">
                            {user.firstName} {user.lastName}
                          </span>

                          <Badge variant="outline" className="rounded-sm h-4 px-1 text-[0.6rem]">
                            {user.role === 'admin' ? <UserStarIcon className="size-[0.6rem]"/> :
                              <UserIcon className="size-[0.6rem]"/>}
                            <span>{translatedRole}</span>
                          </Badge>
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                );
              }) : (
                <Skeleton className="rounded-sm" style={{ height: 32 * pageLimit }}/>
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
            onClick={() => setPage(pv => pv - 1)}
          >
            <ChevronLeftIcon/>
          </Button>

          <div className="border rounded-md p-2 size-8 flex justify-center items-center">
            <span>{searchResult?.page ?? 1}</span>
          </div>

          <Button
            size="icon-sm"
            variant="secondary"
            disabled={!searchResult || !searchResult.hasNextPage || isPendingSearch}
            onClick={() => setPage(pv => pv + 1)}
          >
            <ChevronRightIcon/>
          </Button>

          <Button
            size="icon-sm"
            variant="secondary"
            disabled={!searchResult || isPendingSearch || page === searchResult.totalPages}
            onClick={() => setPage(searchResult?.totalPages ?? 1)}
          >
            <ChevronsRightIcon/>
          </Button>
        </div>

        {value && (
          <div className="p-1 pt-0 space-y-1">
            <Separator/>
            <Button size="sm" variant="ghost" className="w-full" onClick={() => onSelect(undefined, undefined)}>
              <XCircleIcon/>
              <span>{m['components.data_table.clear_filters']()}</span>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};