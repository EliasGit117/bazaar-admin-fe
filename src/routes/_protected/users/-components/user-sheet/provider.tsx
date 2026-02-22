import { type ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/utils';


export enum UserSheetMode {
  Create = 'create',
  Update = 'update'
}

interface IUserSheetCreateOptions {
  mode: UserSheetMode.Create;
}

interface IUserSheetUpdateOptions {
  mode: UserSheetMode.Update;
  userId: number;
}

export type TUserSheetOptions =
  | IUserSheetCreateOptions
  | IUserSheetUpdateOptions;

interface UserSheetContextValue {
  isOpen: boolean;
  options?: TUserSheetOptions;
  open: (options: TUserSheetOptions) => void;
  close: () => void;
}

const {
  Context: UserSheetContext,
  useContext: useUserSheet
} = contextFactory<UserSheetContextValue>({
  name: 'UserSheetContext'
});

export const UserSheetProvider = ({
                                    children
                                  }: {
  children: ReactNode;
}) => {
  const [options, setOptions] = useState<TUserSheetOptions>();

  const open = (opts: TUserSheetOptions) => setOptions(opts);
  const close = () => setOptions(undefined);

  return (
    <UserSheetContext.Provider
      value={{
        isOpen: !!options,
        options: options,
        open: open,
        close: close
      }}
    >
      {children}
    </UserSheetContext.Provider>
  );
};

export { useUserSheet };