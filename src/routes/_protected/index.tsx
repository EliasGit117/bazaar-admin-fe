import { createFileRoute } from '@tanstack/react-router';
import { LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useAuth } from '@/providers/auth.tsx';
import { Spinner } from '@/components/ui/spinner';
import { LogoFull } from '@/components/icons';


export const Route = createFileRoute('/_protected/')({
  component: App
});

function App() {
  const { user, session, isAuthenticated, signOut, isSigningOut } = useAuth();

  return (
    <main className="space-y-4">
      <h1>Welcome to the App</h1>
      <LogoFull className='h-14'/>
      <p>User: {user?.email}</p>
      <p>Session: {session?.id}</p>
      <p>Is authenticated: {isAuthenticated.toString()}</p>
      <div className="flex gap-2 items-center">
        <Button onClick={signOut} variant="destructive" disabled={isSigningOut}>
          {!isSigningOut ? (
            <>
              <LogOutIcon/>
              <span>Sign Out</span>
            </>
          ) : (
            <>
              <Spinner/>
              <span>Signing Out...</span>
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
