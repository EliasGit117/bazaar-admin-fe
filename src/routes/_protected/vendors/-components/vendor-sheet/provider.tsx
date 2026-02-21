import { type ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/utils';

export enum VendorSheetMode {
  Create = 'create',
  Update = 'update',
}

interface IVendorSheetCreateOptions {
  mode: VendorSheetMode.Create;
}

interface IVendorSheetUpdateOptions {
  mode: VendorSheetMode.Update;
  vendorId: number;
}

export type TVendorSheetOptions = | IVendorSheetCreateOptions | IVendorSheetUpdateOptions;

interface VendorSheetContextValue {
  isOpen: boolean;
  options?: TVendorSheetOptions;
  open: (options: TVendorSheetOptions) => void;
  close: () => void;
}

const { Context: VendorSheetContext, useContext: useVendorSheet } = contextFactory<VendorSheetContextValue>({ name: 'VendorSheetContext', });

export const VendorSheetProvider = ({ children, }: { children: ReactNode; }) => {
  const [options, setOptions] = useState<TVendorSheetOptions>();

  const open = (opts: TVendorSheetOptions) => setOptions(opts);
  const close = () => setOptions(undefined);

  return (
    <VendorSheetContext.Provider
      value={{
        isOpen: !!options,
        options: options,
        open: open,
        close: close,
      }}
    >
      {children}
    </VendorSheetContext.Provider>
  );
};

export { VendorSheetContext, useVendorSheet };