import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getZodErrorMap } from '@/lib/zod';
import { getLocale } from '@/paraglide/runtime';
import * as z from 'zod';


interface IContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<IContext>()({
  beforeLoad: () => ({ locale: getLocale() }),
  component: RootComponent,
});


function RootComponent() {
  const { locale } = Route.useRouteContext();

  useEffect(() => {
    document.documentElement.lang = locale;
    getZodErrorMap(locale).then((res) => z.config(res));
  }, [locale]);

  return (
    <>
      <HeadContent/>
      <Outlet />
      <Scripts/>
    </>
  );
}