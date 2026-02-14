import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge.tsx';
import { type AdminUserDto, AdminUserRole, AdminUserStatus } from '@/api/generated';
import {
  ActivityIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleCheckIcon,
  EllipsisVerticalIcon,
  HashIcon,
  IdCardIcon,
  MailIcon,
  MonitorCogIcon,
  ShieldIcon,
  UserIcon,
  UserStarIcon,
  XCircleIcon
} from 'lucide-react';
import { m } from '@/paraglide/messages';
import { useAuth } from '@/providers/auth.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Link } from '@tanstack/react-router';


interface IOptions {
  disabled?: boolean;
}

const columnHelper = createColumnHelper<AdminUserDto>();

export const userColumns = (options?: IOptions) => {
  'use no memo';

  const { disabled } = options ?? {};
  const { user } = useAuth();

  return [
    columnHelper.display({
      size: 24,
      id: 'select',
      enableSorting: false,
      meta: {
        label: m['common.select'](),
        skeletonClassName: 'size-4.5 rounded-sm'
      },
      header: ({ table }) => {
        const rows = table.getPaginationRowModel().rows;
        const selectableRows = rows.filter((row) => user?.id !== row.getValue('id'));
        const allSelected = selectableRows.length > 0 && selectableRows.every((row) => row.getIsSelected());
        const someSelected = selectableRows.some((row) => row.getIsSelected()) && !allSelected;

        return (
          <div className="size-6 pr-2 flex items-center justify-center">
            <Checkbox
              disabled={disabled}
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={(v) => selectableRows.forEach((row) => row.toggleSelected(!!v))}
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="size-6 pr-2 flex items-center justify-center">
          <Checkbox
            disabled={user?.id === row.getValue('id') || disabled}
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        </div>
      )
    }),

    columnHelper.accessor('id', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      meta: {
        label: 'Id',
        icon: HashIcon,
        filter: { type: ColumnFilterType.Number },
        skeletonClassName: 'h-4 w-10'
      },
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>
    }),

    columnHelper.accessor('firstName', {
      size: 20,
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
      meta: {
        label: m['common.first_name'](),
        icon: IdCardIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-14'
      }
    }),

    columnHelper.accessor('lastName', {
      size: 20,
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
      meta: {
        label: m['common.last_name'](),
        icon: IdCardIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-14'
      }
    }),

    columnHelper.accessor('email', {
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
      meta: {
        label: m['common.email'](),
        icon: MailIcon,
        filter: { type: ColumnFilterType.Text },
        skeletonClassName: 'h-4 w-40'
      }
    }),

    columnHelper.accessor('role', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      meta: {
        label: m['common.role'](),
        icon: ShieldIcon,
        skeletonClassName: 'h-5 w-16',
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: m['roles.admin'](), value: AdminUserRole.ADMIN, icon: UserStarIcon },
            { title: m['roles.user'](), value: AdminUserRole.USER, icon: UserIcon }
          ]
        }
      },
      cell: ({ getValue }) => {
        const role = getValue();
        const translated = m[`roles.${role}`] ? m[`roles.${role}`]() : role;

        return (
          <Badge variant={role === 'admin' ? 'outline' : 'secondary'} className="rounded-sm min-h-6">
            {role === 'admin' ? <UserStarIcon/> : <UserIcon/>}
            <span>{translated}</span>
          </Badge>
        );
      }
    }),

    columnHelper.accessor('status', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      meta: {
        label: m['common.status'](),
        icon: ActivityIcon,
        skeletonClassName: 'h-5 w-16',
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: m['common.active'](), value: AdminUserStatus.ACTIVE, icon: CircleCheckIcon },
            { title: m['common.inactive'](), value: AdminUserStatus.INACTIVE, icon: XCircleIcon }
          ]
        }
      },
      cell: ({ getValue }) => {
        const status = getValue();
        const translated = m[`common.${status}`] ? m[`common.${status}`]() : status;

        return (
          <Badge variant={status === 'active' ? 'outline' : 'secondary'} className="rounded-sm min-h-6">
            {status === 'active' && <CheckCircleIcon/>}
            {status === 'inactive' && <XCircleIcon/>}
            <span>{translated}</span>
          </Badge>
        );
      }
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      meta: {
        label: m['common.created'](),
        icon: CalendarIcon,
        filter: { type: ColumnFilterType.DateRange },
        skeletonClassName: 'h-4 w-32'
      },
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy - HH:mm')}
        </span>
      )
    }),

    columnHelper.accessor('updatedAt', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
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

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {m['common.actions']()}
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuItem asChild>
                  <Link to="/sessions" search={{ userId: row.original.id }}>
                    <MonitorCogIcon className="mr-2 size-4"/>
                    <span>{m['pages.users.list.table.sessions']()}</span>
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