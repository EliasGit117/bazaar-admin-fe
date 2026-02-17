import { type ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/utils';


export enum VendorSheetMode {
  Create = 'create',
  Update = 'update',
}

export interface VendorSheetOptions {
  mode: VendorSheetMode;
  vendorId?: number;
}

interface VendorSheetContextValue {
  isOpen: boolean;
  options?: VendorSheetOptions;
  open: (options: VendorSheetOptions) => void;
  close: () => void;
}

const { Context: VendorSheetContext, useContext: useVendorSheet } = contextFactory<VendorSheetContextValue>({ name: 'VendorSheetContext', });

export const VendorSheetProvider = ({ children, }: { children: ReactNode; }) => {
  const [options, setOptions] = useState<VendorSheetOptions>();

  const open = (opts: VendorSheetOptions) => setOptions(opts);
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