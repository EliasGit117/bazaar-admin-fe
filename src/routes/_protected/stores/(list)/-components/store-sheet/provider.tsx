import { type ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/utils';


export enum StoreSheetMode {
  Create = 'create',
  Update = 'update',
}

interface IStoreSheetCreateOptions {
  mode: StoreSheetMode.Create;
}

interface IStoreSheetUpdateOptions {
  mode: StoreSheetMode.Update;
  storeId: number;
}

export type TStoreSheetOptions = IStoreSheetCreateOptions | IStoreSheetUpdateOptions;

interface IStoreSheetContextValue {
  isOpen: boolean;
  options?: TStoreSheetOptions;
  open: (options: TStoreSheetOptions) => void;
  close: () => void;
}

const { Context: StoreSheetContext, useContext: useStoreSheet } = contextFactory<IStoreSheetContextValue>({ name: 'StoreSheetContext' });

const CreateStoreSheetProvider = ({ children }: { children: ReactNode; }) => {
  const [options, setOptions] = useState<TStoreSheetOptions>();

  const open = (opts: TStoreSheetOptions) => setOptions(opts);
  const close = () => setOptions(undefined);

  return (
    <StoreSheetContext.Provider
      value={{
        isOpen: !!options,
        options,
        open,
        close,
      }}
    >
      {children}
    </StoreSheetContext.Provider>
  );
};

export { useStoreSheet, CreateStoreSheetProvider };