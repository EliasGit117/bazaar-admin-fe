import { createFileRoute } from '@tanstack/react-router';
import { SignInCard } from '@/routes/auth/sign-in/-components';
import { m } from '@/paraglide/messages';


export const Route = createFileRoute('/auth/sign-in/')({
  component: RouteComponent,
  head: () => {
    return ({ meta: [{ title: m['pages.auth.sign_in.title']() }] });
  }
});

function RouteComponent() {

  return  (
    <main className="flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-16">
      <SignInCard className='-mt-6'/>
    </main>
  )
}
