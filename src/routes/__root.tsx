import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { getZodErrorMap } from '@/lib/zod';
import { getLocale } from '@/paraglide/runtime';
import type { IRouterContext } from '@/main.tsx';
import * as z from 'zod';
import { useAuth } from '@/providers/auth.tsx';



export const Route = createRootRouteWithContext<IRouterContext>()({
  beforeLoad: () => ({ locale: getLocale() }),
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
  const { user, session } = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [user, session]);

  return null;
}