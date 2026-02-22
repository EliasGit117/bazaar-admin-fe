import { type FC, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Providers } from '@/providers.tsx';
import { QueryClient } from '@tanstack/react-query';
import '@/api/api-client.ts';
import type { AdminSessionDto, AdminUserDto, RolePermissionsDto } from '@/api/generated';
import { useAuth } from '@/providers/auth.tsx';
import type { IBreadcrumb } from '@/components/layout/nav-breadcrumb.tsx';


export interface IApiException {
  statusCode: number;
  error: string;
  message: string | string[];
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: Error | IApiException;
  }
}

export interface IRouterContext {
  queryClient: QueryClient;
  isAuthenticated: boolean;
  user: AdminUserDto | undefined | null;
  session: AdminSessionDto | undefined | null;
  permissions: RolePermissionsDto | undefined | null;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface StaticDataRouteOption {
    crumbs?: IBreadcrumb | IBreadcrumb[];
    hideCrumbs?: boolean;
    headerOptions?: {
      type?: 'fixed' | 'sticky';
    };
  }
}


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      gcTime: 120 * 1000
    }
  }
});

const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
    isAuthenticated: false,
    session: undefined,
    user: undefined,
    permissions: undefined
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0
});

const App: FC = () => {
  const { isAuthenticated, user, session, permissions } = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{ queryClient, isAuthenticated, user, session, permissions }}
    />
  );
};


const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <Providers queryClient={queryClient}>
        <App/>
      </Providers>
    </StrictMode>
  );
}
