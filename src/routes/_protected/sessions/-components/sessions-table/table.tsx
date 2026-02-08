import {
  DataTable, DataTableActionBar,
  DataTablePagination,
  DataTableProvider, DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { sessionColumns } from './columns.tsx';
import { type ComponentProps, type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { exportToCsv } from '@/lib/utils';
import type { AdminSessionDto, PostSessionsSearchData } from '@/api/generated';
import { FileDownIcon, RefreshCwIcon, TrashIcon } from 'lucide-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { sessions_search_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<'div'> {
  search?: PostSessionsSearchData['body'];
}

export const SessionsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  // const { canDelete } = useHasPermissions({ canDelete: { user: [Permission.Delete] } });
  const { canDelete } = { canDelete: true };
  // const { mutate: revokeSessions, isPending: isRevokingSession } = useRevokeSessionsMutation();
  const isRevokingSession = false;


  const { data, isPending: isPendingData, isFetching: isFetchingData, refetch } = useQuery({
    ...sessions_search_QueryOptions({ body: search }),
    gcTime: 0,
    staleTime: 0,
    placeholderData: keepPreviousData
  });

  const columns = useMemo(() => sessionColumns({
    disabled: isFetchingData,
    canDelete: canDelete,
    onRevokeClick: () => {
    }
  }), [isFetchingData, canDelete]);


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
        updated: false,
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
    exportToCsv('sessions.csv', selectedItems.map((session) => ({
      id: session.id,
      userId: session.userId,
      expires: session.expires,
      created: session.created
    })));
  };


  const revokeSelectedSession = () => {
    if (selectedItems?.length <= 0)
      return;

    // revokeSessions({ ids: selectedItems.map(item => item.id) });
  };

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
          {canDelete && (
            <ActionBarButton text="Revoke" icon={TrashIcon} variant="destructive" onClick={revokeSelectedSession}/>
          )}
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};