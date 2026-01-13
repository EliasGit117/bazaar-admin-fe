import './styles.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import reportWebVitals from './reportWebVitals.ts';
import { Providers } from '@/providers.tsx';
import { QueryClient } from '@tanstack/react-query';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      gcTime: 120 * 1000,
    }
  }
});


const router = createRouter({
  routeTree,
  context: { queryClient: queryClient, },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <Providers queryClient={queryClient}>
        <RouterProvider router={router}/>
      </Providers>
    </StrictMode>
  );
}


reportWebVitals();
