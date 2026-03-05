import {
  DataTable,
  DataTableActionBar,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { type ComponentProps, type FC, useMemo } from 'react';
import { cn, exportToCsv } from '@/lib/utils';
import type { ListPaginatedStoresDto, StoreDto } from '@/api/generated';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { stores_post_search_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import { storeColumns } from './columns';
import { AdaptiveButton } from '@/components/ui/adaptive-button';
import { FileDownIcon, RefreshCwIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';
import {
  CreateStoreSheetProvider,
  CreateStoreSheetTrigger
} from '@/routes/_protected/stores/-components/create-store-sheet';
import { CreateStoreSheet } from '@/routes/_protected/stores/-components/create-store-sheet/sheet.tsx';
import { useHasPermissions } from '@/hooks/use-has-permissions.ts';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';


interface IProps extends ComponentProps<'div'> {
  search?: ListPaginatedStoresDto;
}

export const StoresTable: FC<IProps> = ({ className, search = {}, ...divProps }) => {
  'use no memo';

  const permissions = useHasPermissions({
    canCreate: { stores: 'create' },
    canGet: { stores: 'get' },
    canDelete: { stores: 'delete' }
  });

  const { data, isPending, isFetching, refetch } = useQuery({
    ...stores_post_search_QueryOptions({ body: search }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000
  });

  const columns = useMemo(() => storeColumns({
    disabled: isFetching,
    canGet: permissions.canGet,
    canDelete: permissions.canDelete
  }), [isFetching, permissions.canDelete, permissions.canGet]);

  const { table, selectedItems, setRowSelection } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalItems,
    totalPages: data?.totalPages,
    columns,
    initialState: {
      columnVisibility: {
        id: false,
        vendorId: false,
        createdAt: false,
        updatedAt: false
      } satisfies Partial<Record<keyof StoreDto, boolean>>,
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
    exportToCsv('stores.csv', selectedItems);
  };

  return (
    <CreateStoreSheetProvider>
      <div className={cn('space-y-2 relative', className)} {...divProps}>
        <DataTableProvider table={table} loading={isPending}>
          <DataTableToolbar>
            <div className="ml-auto flex items-center gap-1">
              {permissions.canCreate && (
                <CreateStoreSheetTrigger size="sm" variant="ghost" tooltipSide="bottom"/>
              )}

              <AdaptiveButton
                text={m['common.refresh']()}
                size="sm"
                variant="ghost"
                icon={RefreshCwIcon}
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
      </div>

      <CreateStoreSheet/>
    </CreateStoreSheetProvider>
  );
};
