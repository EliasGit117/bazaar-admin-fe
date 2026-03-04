import { createFileRoute, redirect } from '@tanstack/react-router';
import { hasPermission } from '@/lib/utils/has-permission.ts';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/_protected/stores/$storeId')({
  component: RouteComponent,
  beforeLoad: ({ context: { permissions } }) => {
    const can = hasPermission(permissions, 'stores', 'get');
    if (can)
      return;

    throw redirect({ to: '/' });
  }
});

function RouteComponent() {
  const { storeId } = Route.useParams();

  return (
    <main className="space-y-2">
      <h1 className="text-xl font-semibold">{m['common.details']()}</h1>
      <p className="text-sm text-muted-foreground">Store ID: {storeId}</p>
    </main>
  );
}
