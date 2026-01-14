import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AuthLayout } from './-components/auth-layout.tsx';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname !== '/auth')
      return;

    throw redirect({ to: '/auth/sign-in', replace: true });
  }
});

function RouteComponent() {
  return (
    <AuthLayout className="min-h-svh">
      <Outlet/>
    </AuthLayout>
  );
}
