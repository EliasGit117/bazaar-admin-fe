import type { FC, PropsWithChildren } from 'react';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'better-themes';
import { Toaster } from '@/components/ui/sonner.tsx';
import { AuthProvider } from '@/providers/auth.tsx';
import { ConfirmDialogProvider } from '@/components/ui/confirm-dialog.tsx';


interface IProps extends PropsWithChildren {
  queryClient: QueryClient;
}


export const Providers: FC<IProps> = ({ queryClient, children }) => {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="theme" disableTransitionOnChange>
        <ConfirmDialogProvider>
          <AuthProvider>
            {children}
            <Toaster richColors/>
          </AuthProvider>
        </ConfirmDialogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
