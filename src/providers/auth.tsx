import { type PropsWithChildren, useState } from 'react';
import { contextFactory } from '@/lib/utils/context-factory.tsx';
import {
  auth_me_QueryKeys,
  auth_signIn_MutationOptions,
  auth_signOut_MutationOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AdminUserDto, AdminSessionDto, PostAuthSignInData, SessionDataDto } from '@/api/generated';
import { toast } from 'sonner';
import { normalizeError } from '@/lib/utils';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';
import { apiClient } from '@/api/api-client.ts';


interface IAuthContextValue {
  user: AdminUserDto | undefined | null;
  session: AdminSessionDto | undefined | null;
  signIn: (data: Omit<PostAuthSignInData, 'url' | 'path' | 'query'>) => void;
  signOut: () => void;
  isAuthenticated: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  isPendingSessionData: boolean;
}

const { Context: AuthContext, useContext: useAuth } = contextFactory<IAuthContextValue>({ name: 'AuthContext' });


interface IAuthProviderProps extends PropsWithChildren {}

const authStorageKey = 'auth_v0_01';

function readAuth(): SessionDataDto | null | undefined {
  try {
    const raw = localStorage.getItem(authStorageKey);
    if (!raw)
      return null;

    return JSON.parse(raw) as SessionDataDto;
  } catch {
    return null;
  }
}

function writeAuth(data: SessionDataDto) {
  localStorage.setItem(authStorageKey, JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem(authStorageKey);
}

const initialState = readAuth();
let _isAuthenticated = !!initialState?.user && !!initialState?.session;

function AuthProvider({ children }: IAuthProviderProps) {
  const confirm = useConfirm();
  const [sessionData, setSessionData] = useState<SessionDataDto | undefined | null>(initialState);

  const { isPending: isPendingSessionData } = useQuery({
    queryKey: auth_me_QueryKeys(),
    queryFn: async () => {
      const { response, data } = await apiClient.auth.getSessionData({ throwOnError: false });
      if (response.status === 401) {
        setSessionData(null);
        clearAuth();
      }

      if (data?.session == null || data?.user == null)
        throw new Error('Session or user is missing');

      setSessionData(data);
      writeAuth({ user: data!.user, session: data!.session });
      return data;
    },
    enabled: !!initialState,
    initialData: initialState ?? undefined,
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2
  });

  const { mutate: signIn, isPending: isSigningIn } = useMutation({
    ...auth_signIn_MutationOptions(),
    onSuccess: ({ user, session }) => {
      writeAuth({ user: user, session: session });
      setSessionData({ user: user, session: session });
    },
    onError: (error) => {
      const { name, message } = normalizeError(error);
      toast.error(name, { description: message });
    }
  });

  const { mutate: signOut, isPending: isSigningOut } = useMutation({
    ...auth_signOut_MutationOptions(),
    onSuccess: () => {
      setSessionData(null);
      clearAuth();
    },
    onError: async (error) => {
      const isConfirmed = await confirm({
        title: 'Failed to sign out',
        description: `${error.message}\nDo you want to force sign out? Your session won't be closed in API`,
        confirmText: 'Force sign out',
        cancelText: 'Cancel'
      });

      if (!isConfirmed)
        return;

      setSessionData(null);
      clearAuth();
    }
  });

  _isAuthenticated = !!sessionData?.user && !!sessionData?.session;

  const value: IAuthContextValue = {
    user: sessionData?.user,
    session: sessionData?.session,
    isAuthenticated: _isAuthenticated,
    isSigningIn: isSigningIn,
    isSigningOut: isSigningOut,
    isPendingSessionData: isPendingSessionData,
    signIn: signIn,
    signOut: () => signOut({})
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export { useAuth, AuthProvider, _isAuthenticated as isAuthenticated };