import {
  DataTable,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { vendorColumns } from './columns';
import { type ComponentProps, type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ListPaginatedVendorsDto, VendorDto } from '@/api/generated';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { vendors_search_QueryOptions } from '@/api/generated/@tanstack/react-query.gen';
import { AdaptiveButton } from '@/components/ui/adaptive-button';
import { RefreshCwIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';
import {
  VendorSheetMode,
  VendorSheetProvider,
  VendorSheetTrigger
} from '@/routes/_protected/vendors/-components/vendor-sheet';
import { VendorSheet } from '@/routes/_protected/vendors/-components/vendor-sheet/sheet.tsx';


interface IProps extends ComponentProps<'div'> {
  search?: ListPaginatedVendorsDto;
}

export const VendorsTable: FC<IProps> = ({ className, search = {}, ...divProps }) => {
  'use no memo';

  const { data, isPending, isFetching, refetch } = useQuery({
    ...vendors_search_QueryOptions({ body: search }),
    placeholderData: keepPreviousData,
    structuralSharing: false,
    staleTime: 60 * 1000,
    gcTime: 0,
  });

  const columns = useMemo(() => vendorColumns({ disabled: isFetching }), [isFetching]);

  const { table } = useDataTable({
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
        left: [],
        right: []
      }
    }
  });

  return (
    <VendorSheetProvider>
      <div className={cn('space-y-2', className)} {...divProps}>
        <DataTableProvider table={table} loading={isPending}>
          <DataTableToolbar>
            <div className="ml-auto flex items-center gap-1">
              <VendorSheetTrigger
                size="sm"
                variant="ghost"
                options={{ mode: VendorSheetMode.Create }}
              />

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
        </DataTableProvider>
      </div>

      <VendorSheet onSuccess={refetch}/>
    </VendorSheetProvider>
  );
};