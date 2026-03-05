import { createColumnHelper } from '@tanstack/react-table';
import { CurrencyCode, type VendorDto, VendorType } from '@/api/generated';
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import {
  BoxIcon,
  BuildingIcon,
  CalendarIcon, EllipsisVerticalIcon, EuroIcon,
  HashIcon,
  MailIcon, PenIcon,
  PhoneIcon,
  UserCircleIcon,
  UserIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { m } from '@/paraglide/messages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Link } from '@tanstack/react-router';
import {
  useVendorSheet,
  VendorSheetMode
} from '@/routes/_protected/vendors/-components/vendor-sheet';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { cn } from '@/lib/utils';
import { UserSelectDropdown } from '@/components/user-select-dropdown';


interface IOptions {
  disabled?: boolean;
  canEdit?: boolean;
}

const columnHelper = createColumnHelper<VendorDto>();

export const vendorColumns = (options?: IOptions) => {
  'use no memo';

  const { disabled, canEdit } = options ?? {};

  return [
    columnHelper.display({
      size: 24,
      id: 'select',
      enableSorting: false,
      meta: {
        label: m['common.select'](),
        skeletonClassName: 'size-4.5 rounded-sm'
      },
      header: ({ table }) => (
        <div className="size-6 pr-2 flex items-center justify-center">
          <Checkbox
            disabled={disabled}
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="size-6 pr-2 flex items-center justify-center">
          <Checkbox
            disabled={disabled}
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        </div>
      )
    }),

    columnHelper.accessor('id', {
      size: 32,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      meta: {
        label: 'Id',
        filter: { type: ColumnFilterType.Number },
        icon: HashIcon,
        skeletonClassName: 'h-4 w-10'
      }
    }),

    columnHelper.accessor('ownerId', {
      size: 80,
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => (
        <span className="text-xs font-mono">
          {getValue()}
        </span>
      ),
      meta: {
        label: m['pages.sessions.list.table.userId'](),
        icon: UserIcon,
        skeletonClassName: 'h-4 w-10',
        filter: {
          type: ColumnFilterType.Custom,
          render: ({ column }) => {
            const rawValue = column.getFilterValue();
            const value: number | undefined = typeof rawValue === 'number' ? rawValue : undefined;

            return (
              <UserSelectDropdown
                size='sm'
                align='start'
                previewMode='short'
                placeholder={m['common.user']()}
                value={value}
                onValueChange={(v) => column.setFilterValue(v)}
                className="w-full max-w-42 lg:max-w-56 text-xs sm:text-sm"
                prefetch
              />
            )
          }
        }
      }
    }),

    columnHelper.accessor('owner', {
      size: 173,
      enableSorting: false,
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => {
        const value = getValue();
        if (!value)
          return null;

        return (
          <div className="flex items-center gap-2">
            <div className="parent">
              <Avatar className="size-7">
                <AvatarFallback className="text-xs!">
                  {value.firstName[0]}{value.lastName[0]}
                </AvatarFallback>

                <Badge
                  variant="outline"
                  className={cn(
                    "h-3 w-fit px-1! text-muted-foreground",
                    "text-[0.5rem] absolute -bottom-1 z-10 bg-background transform left-1/2 -translate-x-1/2"
                  )}
                >
                  id: {value.id}
                </Badge>
              </Avatar>
            </div>

            <div className="flex flex-col">
              <span className="text-xs">
                {value.firstName} {value.lastName}
              </span>

              <span className="text-xs text-muted-foreground">
                {value.email}
              </span>
            </div>
          </div>
        );
      },
      meta: {
        label: m['pages.vendors.list.table.owner'](),
        icon: UserCircleIcon,
        skeletonItem:
          <div className="flex gap-2">
            <Skeleton className="size-7 rounded-full"/>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-12"/>
              <Skeleton className="h-3 w-32"/>
            </div>
          </div>
      }
    }),

    columnHelper.accessor('name', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <p className="text-xs">{getValue()}</p>,
      meta: {
        icon: BuildingIcon,
        label: m['common.name'](),
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-28'
      }
    }),

    columnHelper.accessor('email', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <p className="text-xs">{getValue()}</p>,
      meta: {
        label: m['common.email'](),
        icon: MailIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-40'
      }
    }),

    columnHelper.accessor('phone', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <p className="text-xs">{getValue()}</p>,
      meta: {
        label: m['common.phone'](),
        icon: PhoneIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-24'
      }
    }),


    columnHelper.accessor('idno', {
      size: 256,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <p className="text-xs">{getValue()}</p>,
      meta: {
        label: 'IDNO',
        filter: { type: ColumnFilterType.Text },
        icon: HashIcon,
        skeletonClassName: 'h-4 w-32'
      }
    }),

    columnHelper.accessor('iban', {
      size: 324,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <p className="text-xs">{getValue()}</p>,
      meta: {
        label: 'IBAN',
        filter: { type: ColumnFilterType.Text },
        icon: HashIcon,
        skeletonClassName: 'h-4 w-48'
      }
    }),

    columnHelper.accessor('currency', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <p className="text-xs">{getValue()}</p>,
      meta: {
        label: m['pages.vendors.list.table.currency'](),
        icon: EuroIcon,
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: Object.values(CurrencyCode).map((cur) => ({ title: cur, value: cur }))
        },
        skeletonClassName: 'h-4 w-10'
      }
    }),

    columnHelper.accessor('type', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => {
        const type = getValue();

        return (
          <Badge variant="outline" className="rounded-sm min-h-6">
            {type === VendorType.SRL && <BuildingIcon/>}
            {type === VendorType.IP && <UserIcon/>}
            <span>{type}</span>
          </Badge>
        );
      },
      meta: {
        label: m['common.type'](),
        skeletonClassName: 'h-5 w-14',
        icon: BoxIcon,
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: 'IP', icon: UserIcon, value: VendorType.IP },
            { title: 'SRL', icon: BuildingIcon, value: VendorType.SRL }
          ]
        }
      }
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy HH:mm')}
        </span>
      ),
      meta: {
        label: m['common.created'](),
        icon: CalendarIcon,
        filter: { type: ColumnFilterType.DateRange },
        skeletonClassName: 'h-4 w-32'
      }
    }),

    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        icon: CalendarIcon,
        label: m['common.updated'](),
        filter: { type: ColumnFilterType.DateRange },
        skeletonClassName: 'h-4 w-32'
      }
    }),

    // Actions
    columnHelper.display({
      id: 'actions',
      size: 40,
      meta: {
        label: 'Actions',
        skeletonClassName: 'size-6 ml-auto'
      },
      cell: ({ row }) => {

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-xs" variant="ghost">
                  <EllipsisVerticalIcon/>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-fit min-w-42" align="end">
                <DropdownMenuLabel>
                  {m['common.actions']()}
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                {canEdit && <EditMenuItem vendorId={row.original.id} disabled={disabled}/>}

                <DropdownMenuItem asChild>
                  <Link to="/users" search={{ id: row.original.ownerId }}>
                    <UserCircleIcon className="mr-2 size-4"/>
                    <span>{m['common.owner']()}</span>
                  </Link>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    })
  ];
};

interface IEditMenuItem extends ComponentPropsWithoutRef<typeof DropdownMenuItem> {
  vendorId: number;
}

const EditMenuItem: FC<IEditMenuItem> = ({ vendorId, ...props }) => {
  const { open } = useVendorSheet();

  return (
    <DropdownMenuItem {...props} onClick={() => open({ mode: VendorSheetMode.Update, vendorId: vendorId })}>
      <PenIcon className="mr-2 size-4"/>
      <span>{m['common.edit']()}</span>
    </DropdownMenuItem>
  );
};
