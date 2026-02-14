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
  users_search_QueryOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { FileDownIcon, RefreshCwIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { toast } from 'sonner';


interface IProps extends ComponentProps<'div'> {
  search?: PostUsersSearchData['body'];
}

export const UsersTable: FC<IProps> = ({ className, search = {}, ...divProps }) => {
  "use no memo";

  const { data, isPending, isFetching, refetch, error } = useQuery({
    ...users_search_QueryOptions({ body: search }),
    gcTime: 0,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    structuralSharing: false,
  });

  const columns = useMemo(() => userColumns({ disabled: isFetching }), [isFetching]);

  const { table, selectedItems, setRowSelection } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalItems,
    totalPages: data?.totalPages,
    columns,
    initialState: {
      columnVisibility: {
        updatedAt: false,
      } satisfies Partial<Record<keyof AdminUserDto, boolean>>,

      columnPinning: {
        left: ['select'],
        right: ['actions']
      },
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
      <DataTableProvider
        table={table}
        loading={isPending}
      >
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

        <DataTable/>
        <DataTablePagination/>

        <DataTableActionBar disabled={isFetching}>
          <ActionBarButton text="CSV" icon={FileDownIcon} onClick={onExportToCsvClick}/>
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};