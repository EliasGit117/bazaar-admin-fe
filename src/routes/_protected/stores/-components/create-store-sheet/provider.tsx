import { type ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/utils';


interface IStoreSheetContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const { Context: StoreSheetContext, useContext: useStoreSheet } = contextFactory<IStoreSheetContextValue>({ name: 'StoreSheetContext' });

const CreateStoreSheetProvider = ({ children }: { children: ReactNode; }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <StoreSheetContext.Provider
      value={{
        isOpen: open,
        open: () => setOpen(true),
        close: () => setOpen(false)
      }}
    >
      {children}
    </StoreSheetContext.Provider>
  );
};

export { useStoreSheet, CreateStoreSheetProvider };