import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout.tsx';

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: ({ context: { isAuthenticated } }) => {
    if (isAuthenticated)
      return;

    throw redirect({ to: '/auth/sign-in' });
  }
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet/>
    </AppLayout>
  );
}
