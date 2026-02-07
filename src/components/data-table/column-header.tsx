import { type Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { type HTMLAttributes } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, DotIcon, EraserIcon, EyeOffIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';


interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  iconHidden?: boolean;
}

export function DataTableColumnHeader<TData, TValue>(props: DataTableColumnHeaderProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { column, title: customTitle, className, iconHidden } = props;
  const isSorted = column.getIsSorted();
  const title = customTitle ?? column.columnDef.meta?.label ?? column.id;
  const Icon = !iconHidden ? column.columnDef.meta?.icon : undefined;

  if (!column.getCanSort()) {
    return (
      <div className={cn(className, 'flex items-center gap-2')}>
        {Icon && <Icon className="size-4 text-muted-foreground"/>}
        <span>{title}</span>
      </div>
    );
  }

  const toggleSorting = (value: boolean) => column.toggleSorting(value);
  const clearSorting = () => column.clearSorting();
  const hide = () => column.toggleVisibility(false);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="data-[state=open]:bg-accent -ml-3 h-fit py-1 flex items-center gap-2"
          >
            {Icon && <Icon className="text-muted-foreground"/>}
            <span>{title}</span>

            {isSorted === 'desc' ? (
              <ChevronDownIcon className=' text-muted-foreground'/>
            ) : isSorted === 'asc' ? (
              <ChevronUpIcon className=' text-muted-foreground'/>
            ) : (
              <ChevronsUpDownIcon className=' text-muted-foreground'/>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-fit min-w-42' align="start">
          <DropdownMenuItem onClick={() => toggleSorting(false)}>
            <ChevronUpIcon/>
            <span>{m['common.asc']()}</span>
            {isSorted === 'asc' && (<DotIcon className='ml-auto stroke-5'/>)}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => toggleSorting(true)}>
            <ChevronDownIcon/>
            <span>{m['common.desc']()}</span>
            {isSorted === 'desc' && (<DotIcon className='ml-auto stroke-5'/>)}
          </DropdownMenuItem>

          {isSorted && (
            <DropdownMenuItem onClick={clearSorting}>
              <EraserIcon/>
              <span>{m['components.data_table.clear']()}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator/>

          <DropdownMenuItem onClick={hide}>
            <EyeOffIcon/>
            <span>{m['components.data_table.hide']()}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
