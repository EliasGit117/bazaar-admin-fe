import {
  DataTable,
  DataTableActionBar,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { vendorColumns } from './columns';
import { type ComponentProps, type FC, useMemo } from 'react';
import { cn, exportToCsv } from '@/lib/utils';
import type { ListPaginatedVendorsDto, VendorDto } from '@/api/generated';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AdaptiveButton } from '@/components/ui/adaptive-button';
import { FileDownIcon, RefreshCwIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';
import {
  VendorSheetMode,
  VendorSheetProvider,
  VendorSheetTrigger
} from '@/routes/_protected/vendors/-components/vendor-sheet';
import { VendorSheet } from '@/routes/_protected/vendors/-components/vendor-sheet/sheet.tsx';
import { useHasPermissions } from '@/hooks/use-has-permissions.ts';
import { vendors_post_search_QueryOptions } from '@/api/generated/@tanstack/react-query.gen.ts';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';


interface IProps extends ComponentProps<'div'> {
  search?: ListPaginatedVendorsDto;
}

export const VendorsTable: FC<IProps> = ({ className, search = {}, ...divProps }) => {
  'use no memo';

  const permissions = useHasPermissions({
    canCreate: { vendors: 'create' },
    canEdit: { vendors: 'update' }
  });

  const { data, isPending, isFetching, refetch } = useQuery({
    ...vendors_post_search_QueryOptions({ body: search }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 0
  });

  const columns = useMemo(() => vendorColumns({
    disabled: isFetching,
    canEdit: permissions.canEdit
  }), [isFetching, permissions.canEdit]);

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
        ownerId: false,
        createdAt: false,
        updatedAt: false
      } satisfies Partial<Record<keyof VendorDto, boolean>>,
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
    exportToCsv('vendors.csv', selectedItems);
  };

  return (
    <VendorSheetProvider>
      <div className={cn('space-y-2 relative', className)} {...divProps}>
        <DataTableProvider table={table} loading={isPending}>
          <DataTableToolbar>
            <div className="ml-auto flex items-center gap-1">
              {permissions.canCreate && (
                <VendorSheetTrigger size="sm" variant="ghost" options={{ mode: VendorSheetMode.Create }}/>
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

      <VendorSheet onSuccess={refetch}/>
    </VendorSheetProvider>
  );
};
