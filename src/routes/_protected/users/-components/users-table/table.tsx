import {
  DataTable, DataTableActionBar,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { userColumns } from './columns';
import { type FC, type ComponentProps, useMemo, useEffect } from 'react';
import { cn, exportToCsv, normalizeError } from '@/lib/utils';
import type { AdminUserDto, PostUsersSearchData } from '@/api/generated';
import {
  keepPreviousData,
  useQuery
} from '@tanstack/react-query';
import {
  users_post_search_QueryOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { FileDownIcon, RefreshCwIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth.tsx';
import { UserSheetMode, UserSheetProvider, UserSheetTrigger } from '@/routes/_protected/users/-components/user-sheet';
import { useHasPermissions } from '@/hooks/use-has-permissions.ts';
import { UserSheet } from '@/routes/_protected/users/-components/user-sheet/sheet.tsx';


interface IProps extends ComponentProps<'div'> {
  search?: PostUsersSearchData['body'];
}

export const UsersTable: FC<IProps> = ({ className, search = {}, ...divProps }) => {
  'use no memo';

  const { user } = useAuth();
  const permissions = useHasPermissions({
    canCreate: { users: 'create' },
    canEdit: { users: 'update' }
  });

  const { data, isPending, isFetching, refetch, error } = useQuery({
    ...users_post_search_QueryOptions({ body: search }),
    gcTime: 0,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    structuralSharing: false
  });

  const columns = useMemo(() => userColumns({
    userId: user?.id,
    disabled: isFetching,
    canEdit: permissions.canEdit
  }), [isFetching, permissions.canEdit]);

  const { table, selectedItems, setRowSelection } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalItems,
    totalPages: data?.totalPages,
    columns,
    initialState: {
      columnVisibility: {
        updatedAt: false
      } satisfies Partial<Record<keyof AdminUserDto, boolean>>,

      columnPinning: {
        left: ['select'],
        right: ['actions']
      }
    }
  });

  const onExportToCsvClick = () => {
    if (!selectedItems.length)
      return;

    setRowSelection({});
    exportToCsv('users.csv', selectedItems);
  };

  useEffect(() => {
    if (error == null)
      return;

    const { name, message } = normalizeError(error);
    toast.error(name, { description: message });
  }, [error]);

  return (
    <div
      className={cn('space-y-2', className)}
      {...divProps}
    >
      <UserSheetProvider>
        <DataTableProvider table={table} loading={isPending}>
          <DataTableToolbar>
            <div className="ml-auto flex items-center gap-1">
              {permissions.canCreate && (
                <UserSheetTrigger size="sm" variant="ghost" options={{ mode: UserSheetMode.Create }}/>
              )}

              <AdaptiveButton
                size="sm"
                variant="ghost"
                icon={RefreshCwIcon}
                text={m['common.refresh']()}
                onClick={() => refetch()}
              />
            </div>
          </DataTableToolbar>

          <DataTable/>
          <DataTablePagination/>

          <DataTableActionBar disabled={isFetching}>
            <ActionBarButton text="CSV" icon={FileDownIcon} onClick={onExportToCsvClick}/>
          </DataTableActionBar>
        </DataTableProvider>

        <UserSheet onSuccess={refetch}/>
      </UserSheetProvider>
    </div>
  );
};