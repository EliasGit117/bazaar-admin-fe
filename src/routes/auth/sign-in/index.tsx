import { createFileRoute } from '@tanstack/react-router';
import { SignInCard } from '@/routes/auth/sign-in/-components';
import { m } from '@/paraglide/messages';



export const Route = createFileRoute('/auth/sign-in/')({
  component: RouteComponent,
  head: () => {
    return ({ meta: [{ title: m['pages.auth.sign_in.title']() }] })
  },
});

function RouteComponent() {
  return (
    <main className='flex justify-center p-4 absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full'>
      <SignInCard/>
    </main>
  );
}
