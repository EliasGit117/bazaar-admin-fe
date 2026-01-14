import type { FC, PropsWithChildren } from 'react';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'better-themes';
import { Toaster } from '@/components/ui/sonner.tsx';


interface IProps extends PropsWithChildren {
  queryClient: QueryClient;
}


export const Providers: FC<IProps> = ({ queryClient, children }) => {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='system' storageKey="theme" disableTransitionOnChange>
        {children}
        <Toaster richColors/>
      </ThemeProvider>
    </QueryClientProvider>
  );
};