import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { UAParser } from 'ua-parser-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from '@tanstack/react-router';
import type { AdminSessionDto } from '@/api/generated';
import {
  CalendarIcon,
  CheckIcon,
  CircleQuestionMarkIcon,
  ClockIcon,
  CopyIcon,
  EarthIcon,
  EllipsisVerticalIcon,
  HashIcon,
  InfoIcon,
  LaptopIcon,
  SmartphoneIcon,
  SquareCheckIcon,
  SquareIcon,
  SquareMinusIcon,
  TrashIcon,
  UserCircleIcon, UserIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { cn } from '@/lib/utils';
import { ChromeIcon, EdgeIcon, FirefoxIcon, OperaIcon, SafariIcon } from '@/components/icons';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard.ts';
import { m } from '@/paraglide/messages';



interface IOptions {
  disabled?: boolean;
  canDelete?: boolean;
  onRevokeClick?: (id: string) => void;
}


const columnHelper = createColumnHelper<AdminSessionDto>();

export const sessionColumns = (options?: IOptions) => {
  const { disabled, canDelete, onRevokeClick } = options ?? {};

  return ([
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
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => {
        const { isCopied, copyToClipboard } = useCopyToClipboard();
        const value = getValue();

        return (
          <div className="flex gap-1 items-center">
            <span className="text-xs font-mono">
              {value}
            </span>
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground"
                    onClick={() => copyToClipboard(value)}>
              {isCopied ? <CheckIcon/> : <CopyIcon/>}
            </Button>
          </div>
        );
      },
      meta: {
        label: 'Id',
        icon: HashIcon,
        skeletonClassName: 'h-4 w-10',
        filter: { type: ColumnFilterType.Text }
      }
    }),

    columnHelper.accessor('userId', {
      size: 80,
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => (
        <span className="text-xs font-mono">
          {getValue()}
        </span>
      ),
      meta: {
        label: m['pages.users.list.table.userId'](),
        icon: UserIcon,
        skeletonClassName: 'h-4 w-10',
        filter: { type: ColumnFilterType.Number, min: 1, placeholder: m['pages.users.list.table.userId']() }
      }
    }),

    columnHelper.accessor('user', {
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
        label: m['pages.users.list.table.user'](),
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

    columnHelper.accessor('userAgent', {
      header: ({ column }) => <DataTableColumnHeader column={column}/>,
      cell: ({ getValue }) => {
        const ua = getValue();
        if (!ua)
          return '—';

        const { os, browser, device } = UAParser(getValue() ?? '');
        const isMobile = device.type === 'mobile';
        const DeviceIcon = isMobile ? SmartphoneIcon : LaptopIcon;
        const BrowserIcon = getBrowserIcon(browser.name);

        return (
          <div className="flex items-center gap-2 text-xs">
            <div className="leading-tight">
              <div className="flex gap-1 items-center">
                <BrowserIcon className="size-3 text-muted-foreground"/>
                <div>
                  {browser.name ?? 'Unknown'}{' '}
                  {browser.version?.split('.')[0]}
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <DeviceIcon className="size-3"/>
                <span>{os.name}</span>
              </div>
            </div>
          </div>
        );
      },
      meta: {
        label: m['pages.users.list.table.agent'](),
        icon: LaptopIcon,
        skeletonItem:
          <div className="space-y-1">
            <div className="flex gap-1">
              <Skeleton className="size-3"/>
              <Skeleton className="h-3 w-full max-w-16"/>
            </div>
            <div className="flex gap-1">
              <Skeleton className="size-3"/>
              <Skeleton className="h-3 w-full max-w-10"/>
            </div>
          </div>
      }
    }),

    columnHelper.accessor('ipAddress', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">
          {getValue() ?? '—'}
        </span>
      ),
      meta: {
        label: m['pages.users.list.table.ipAddress'](),
        icon: EarthIcon,
        skeletonClassName: 'h-4 w-28'
      }
    }),

    columnHelper.accessor('created', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
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

    columnHelper.accessor('updated', {
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

    columnHelper.accessor('expires', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: m['common.expires'](),
        icon: ClockIcon,
        filter: { type: ColumnFilterType.DateRange },
        skeletonClassName: 'h-4 w-32'
      }
    }),


    columnHelper.display({
      id: 'type',
      size: 87,
      enableSorting: false,
      meta: {
        icon: InfoIcon,
        label: m['pages.users.list.table.type'](),
        skeletonClassName: 'h-5.5 w-20 rounded-sm'
      },
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ row }) => {
        const { isCurrent, isOwned } = row.original;

        return (
          <Badge
            variant={isOwned ? (isCurrent ? 'default' : 'secondary') : 'outline'}
            className={cn('rounded-sm min-h-6', (!isCurrent && isOwned) && 'border border-border')}
          >
            {isOwned ? (isCurrent ? (<SquareCheckIcon/>) : (<SquareMinusIcon/>)) : (<SquareIcon/>)}
            <span>
              {isOwned ? (
                isCurrent ? m['pages.users.list.table.current']() : m['pages.users.list.table.other']()
              ) : (
                m['pages.users.list.table.external']()
              )}
            </span>
          </Badge>
        );
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
                  <Link to="/">
                    <UserCircleIcon className="mr-2 size-4"/>
                    <span>{m['pages.users.list.table.owner']()}</span>
                  </Link>
                </DropdownMenuItem>

                {(!!onRevokeClick && canDelete) && (
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={disabled}
                    onClick={() => onRevokeClick?.(row.original.id)}
                  >
                    <TrashIcon className="mr-2 size-4"/>
                    <span>{m['common.revoke']()}</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    })
  ]);
};

function getBrowserIcon(name?: string) {
  switch (name?.toLowerCase()) {
    case 'chrome':
    case 'mobile chrome':
      return ChromeIcon;
    case 'firefox':
    case 'mobile firefox':
      return FirefoxIcon;
    case 'safari':
    case 'mobile safari':
      return SafariIcon;
    case 'edge':
      return EdgeIcon;
    case 'opera':
    case 'mobile opera':
      return OperaIcon;
    default:
      return CircleQuestionMarkIcon;
  }
}