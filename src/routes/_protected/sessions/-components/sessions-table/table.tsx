import {
  DataTable, DataTableActionBar,
  DataTablePagination,
  DataTableProvider, DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { sessionColumns } from './columns.tsx';
import { type ComponentProps, type FC, useEffect, useMemo } from 'react';
import { cn, normalizeError } from '@/lib/utils';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { exportToCsv } from '@/lib/utils';
import type { AdminSessionDto, PostSessionsSearchData } from '@/api/generated';
import { FileDownIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  sessions_revoke_MutationOptions, sessions_search_QueryKeys,
  sessions_search_QueryOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import { m } from '@/paraglide/messages';
import { useHasPermissions } from '@/hooks/use-has-permissions.ts';
import { toast } from 'sonner';


interface IProps extends ComponentProps<'div'> {
  search?: PostSessionsSearchData['body'];
}

export const SessionsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  const queryClient = useQueryClient();
  const permissions = useHasPermissions({ canDeleteSessions: { sessions: 'delete' } });

  const { data, isPending: isPendingData, isFetching: isFetchingData, refetch, error } = useQuery({
    ...sessions_search_QueryOptions({ body: search }),
    gcTime: 0,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    structuralSharing: false
  });

  const { mutate: revokeSessions, isPending: isRevokingSession } = useMutation({
    ...sessions_revoke_MutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessions_search_QueryKeys({ body: search }) });
    }
  });

  const columns = useMemo(() => sessionColumns({
    disabled: isFetchingData,
    canDelete: permissions.canDeleteSessions,
    onRevokeClick: (id) => revokeSessions({ query: { ids: [id] } })
  }), [isFetchingData, permissions.canDeleteSessions]);


  const { table, selectedItems, setRowSelection } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalItems,
    totalPages: data?.totalPages,
    columns: columns,
    initialState: {
      columnVisibility: {
        id: false,
        updatedAt: false,
        userId: false
      } satisfies Partial<Record<keyof AdminSessionDto, boolean>>,
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
    exportToCsv('sessions.csv', selectedItems);
  };


  const revokeSelectedSession = () => {
    if (selectedItems?.length <= 0)
      return;

    revokeSessions({ query: { ids: selectedItems.map(item => item.id) } });
  };

  useEffect(() => {
    if (error == null)
      return;

    const { name, message } = normalizeError(error);
    toast.error(name, { description: message });
  }, [error]);


  return (
    <div className={cn('space-y-2', className)} {...divProps}>
      <DataTableProvider table={table} loading={isPendingData}>
        <DataTableToolbar>
          <AdaptiveButton
            text={m['common.refresh']()}
            size="sm"
            variant="ghost"
            icon={RefreshCwIcon}
            className="ml-auto"
            onClick={() => refetch()}
          />
        </DataTableToolbar>

        <DataTable skeletonTableCellClassName="h-[49px]"/>
        <DataTablePagination/>

        <DataTableActionBar disabled={isFetchingData || isRevokingSession}>
          <ActionBarButton text="CSV" icon={FileDownIcon} onClick={onExportToCsvClick}/>
          {permissions.canDeleteSessions && (
            <ActionBarButton
              text={m['pages.sessions.list.table.revoke']()}
              icon={TrashIcon}
              variant="destructive"
              onClick={revokeSelectedSession}
            />
          )}
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};