import { createColumnHelper } from '@tanstack/react-table';
import { CurrencyCode, type VendorDto, VendorType } from '@/api/generated';
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import {
  BoxIcon,
  BuildingIcon,
  CalendarIcon, EuroIcon,
  HashIcon,
  MailIcon,
  PhoneIcon,
  UserCircleIcon,
  UserIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { m } from '@/paraglide/messages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';


interface IOptions {
  disabled?: boolean;
}

const columnHelper = createColumnHelper<VendorDto>();

export const vendorColumns = (options?: IOptions) => {
  "use no memo";

  const { } = options ?? {};

  return [
    columnHelper.accessor('id', {
      size: 32,
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      meta: {
        label: 'Id',
        filter: { type: ColumnFilterType.Number },
        icon: HashIcon,
        skeletonClassName: 'h-4 w-10'
      }
    }),

    columnHelper.accessor('ownerId', {
      size: 32,
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      meta: {
        label: `${m['pages.vendors.list.table.owner']()} (id)`,
        icon: UserIcon,
        filter: { type: ColumnFilterType.Number },
        skeletonClassName: 'h-4 w-10'
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
            <Avatar className="size-7">
              <AvatarFallback className="text-xs!">{value.firstName[0]}{value.lastName[0]}</AvatarFallback>
            </Avatar>

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
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => <p className='text-xs'>{getValue()}</p>,
      meta: {
        icon: BuildingIcon,
        label: m['common.name'](),
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-28'
      }
    }),

    columnHelper.accessor('email', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => <p className='text-xs'>{getValue()}</p>,
      meta: {
        label: m['common.email'](),
        icon: MailIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-40'
      }
    }),

    columnHelper.accessor('phone', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => <p className='text-xs'>{getValue()}</p>,
      meta: {
        label: m['common.phone'](),
        icon: PhoneIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-24'
      }
    }),


    columnHelper.accessor('idno', {
      size: 256,
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => <p className='text-xs'>{getValue()}</p>,
      meta: {
        label: 'IDNO',
        filter: { type: ColumnFilterType.Text },
        icon: HashIcon,
        skeletonClassName: 'h-4 w-32'
      }
    }),

    columnHelper.accessor('iban', {
      size: 324,
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => <p className='text-xs'>{getValue()}</p>,
      meta: {
        label: 'IBAN',
        filter: { type: ColumnFilterType.Text },
        icon: HashIcon,
        skeletonClassName: 'h-4 w-48'
      }
    }),

    columnHelper.accessor('currency', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => <p className='text-xs'>{getValue()}</p>,
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
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => {
        const type = getValue();

        return (
          <Badge variant='outline' className="rounded-sm min-h-6">
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
      header: ({ column }) => <DataTableColumnHeader column={column} />,
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
  ];
};