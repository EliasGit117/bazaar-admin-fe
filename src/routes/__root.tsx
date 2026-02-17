import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { getZodErrorMap } from '@/lib/zod';
import { getLocale } from '@/paraglide/runtime';
import type { IRouterContext } from '@/main.tsx';
import * as z from 'zod';
import { useAuth } from '@/providers/auth.tsx';
import { envConfig } from '@/lib/utils';



export const Route = createRootRouteWithContext<IRouterContext>()({
  beforeLoad: () => ({ locale: getLocale() }),
  head: () => ({ meta: [{ title: envConfig.appName ?? 'Application' }] }),
  component: RootComponent,
});


function RootComponent() {
  const { locale} = Route.useRouteContext();

  useEffect(() => {
    document.documentElement.lang = locale;
    getZodErrorMap(locale).then((res) => z.config(res));
  }, [locale]);

  return (
    <>
      <HeadContent/>
      <Outlet />
      <AuthRouteInvalidation />
      <Scripts/>
    </>
  );
}

const AuthRouteInvalidation = () => {
  const router = useRouter();
  const { user, session, permissions } = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [user, session, permissions]);

  return null;
}