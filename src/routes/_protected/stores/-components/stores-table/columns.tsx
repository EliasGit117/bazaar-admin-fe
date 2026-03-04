import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { type StoreBriefDto, StoreStatus } from '@/api/generated';
import {
  ActivityIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  HashIcon,
  LinkIcon,
  StoreIcon,
  Trash2Icon,
  UserCircleIcon
} from 'lucide-react';
import { m } from '@/paraglide/messages';
import { Badge } from '@/components/ui/badge.tsx';
import { VendorSelectDropdown } from '@/components/vendor-select-dropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { getStoreStatusIcon, StoreStatusIcon } from '@/components/icons/store-status-icon.tsx';



const columnHelper = createColumnHelper<StoreBriefDto>();

interface IOptions {
  disabled?: boolean;
  canGet?: boolean;
  canDelete?: boolean;
}

export const storeColumns = (options?: IOptions) => {
  'use no memo';

  const { disabled, canDelete, canGet } = options ?? {};

  const statusTitle: Record<StoreStatus, string> = {
    [StoreStatus.ACTIVE]: m['common.active'](),
    [StoreStatus.INACTIVE]: m['common.inactive'](),
    [StoreStatus.DRAFT]: m['common.draft'](),
    [StoreStatus.ARCHIVED]: m['common.archived']()
  };

  return [
    columnHelper.accessor('id', {
      size: 32,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
      meta: {
        label: 'Id',
        icon: HashIcon,
        filter: { type: ColumnFilterType.Number },
        skeletonClassName: 'h-4 w-10'
      }
    }),

    columnHelper.accessor('name', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
      meta: {
        label: m['common.name'](),
        icon: StoreIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-24'
      }
    }),

    columnHelper.accessor('slug', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
      meta: {
        label: m['pages.stores.list.sheet.slug'](),
        icon: LinkIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-32'
      }
    }),

    columnHelper.accessor('vendorId', {
      size: 80,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => <span className="text-xs font-mono">{getValue()}</span>,
      meta: {
        label: m['common.vendor'](),
        icon: UserCircleIcon,
        skeletonClassName: 'h-4 w-10',
        filter: {
          type: ColumnFilterType.Custom,
          render: ({ column }) => {
            const rawValue = column.getFilterValue();
            const value: number | undefined = typeof rawValue === 'number' ? rawValue : undefined;

            return (
              <VendorSelectDropdown
                size="sm"
                align="start"
                placeholder={m['common.vendor']()}
                value={value}
                onValueChange={(v) => column.setFilterValue(v)}
                className="w-full max-w-42 lg:max-w-56 text-xs sm:text-sm"
                prefetch
              />
            );
          }
        }
      }
    }),

    columnHelper.accessor('vendor', {
      size: 180,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => {
        const vendor = getValue();
        if (!vendor)
          return <span className="text-xs text-muted-foreground">-</span>;

        return <span className="text-xs">{vendor.name}</span>;
      },
      meta: {
        label: m['common.vendor'](),
        icon: UserCircleIcon,
        skeletonClassName: 'h-4 w-24'
      }
    }),

    columnHelper.accessor('status', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      meta: {
        label: m['common.status'](),
        icon: ActivityIcon,
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: Object.values(StoreStatus).map((status) => ({
            value: status,
            title: statusTitle[status],
            icon: getStoreStatusIcon(status)
          }))
        },
        skeletonClassName: 'h-5 w-20'
      },
      cell: ({ getValue }) => {
        const status = getValue();

        return (
          <Badge variant={status === StoreStatus.ACTIVE ? 'outline' : 'secondary'} className="rounded-sm min-h-6">
            <StoreStatusIcon status={status}/>
            <span>{statusTitle[status]}</span>
          </Badge>
        );
      }
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy - HH:mm')}
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
        label: m['common.updated'](),
        icon: CalendarIcon,
        filter: { type: ColumnFilterType.DateRange },
        skeletonClassName: 'h-4 w-32'
      }
    }),

    columnHelper.display({
      id: 'actions',
      size: 40,
      meta: {
        label: 'Actions',
        skeletonClassName: 'size-6 ml-auto'
      },
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-xs" variant="ghost">
                <EllipsisVerticalIcon/>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-40 w-fit">
              <DropdownMenuLabel>
                {m['common.actions']()}
              </DropdownMenuLabel>

              <DropdownMenuSeparator/>

              {canGet && <DetailsMenuItem storeId={row.original.id} disabled={disabled}/>}

              {canDelete && (
                <DropdownMenuItem disabled={disabled} variant='destructive'>
                  <Trash2Icon className="mr-2 size-4"/>
                  <span>{m['common.delete']()}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    })
  ];
};

interface IDetailsMenuItem extends ComponentPropsWithoutRef<typeof DropdownMenuItem> {
  storeId: number;
}

const DetailsMenuItem: FC<IDetailsMenuItem> = ({ storeId, ...props }) => (
  <DropdownMenuItem {...props} asChild>
    <Link to="/stores/$storeId" params={{ storeId: String(storeId) }}>
      <StoreIcon className="mr-2 size-4"/>
      <span>{m['common.details']()}</span>
    </Link>
  </DropdownMenuItem>
);
