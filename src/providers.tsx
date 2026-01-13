import type { FC, PropsWithChildren } from 'react';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IProps extends PropsWithChildren {
  queryClient: QueryClient;
}

export const Providers: FC<IProps> = ({ queryClient, children }) => {

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};