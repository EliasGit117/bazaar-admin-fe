import { type FC, Fragment, useState } from 'react';
import {
  keepPreviousData, useMutation,
  useQuery, useQueryClient
} from '@tanstack/react-query';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { cn, normalizeError } from '@/lib/utils';
import { useAuth } from '@/providers/auth.tsx';
import {
  sessions_revoke_MutationOptions, sessions_revokeAll_MutationOptions, sessions_search_QueryKeys,
  sessions_search_QueryOptions
} from '@/api/generated/@tanstack/react-query.gen.ts';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LaptopIcon,
  LogOutIcon,
  RotateCw,
  SmartphoneIcon,
  TrashIcon,
  XIcon
} from 'lucide-react';
import { UAParser } from 'ua-parser-js';
import { Badge } from '@/components/ui/badge.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';
import { useIsMobile } from '@/hooks/use-mobile.ts';
import type { PostSessionsSearchData } from '@/api/generated';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';


export interface ISessionsCardProps {
  className?: string;
}

export const SessionsCard: FC<ISessionsCardProps> = ({ className }) => {
  const { session: currentSession } = useAuth();
  const confirm = useConfirm();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const body: PostSessionsSearchData['body'] = { page: page, limit: 5, status: ['active'] };

  const { data, isPending, isFetching, refetch } = useQuery({
    ...sessions_search_QueryOptions({ body: body }),
    placeholderData: keepPreviousData
  });

  const [revokingState, setRevokingState] = useState<Record<string, boolean>>({});

  const { mutate: revoke, isPending: isRevoking } = useMutation({
    ...sessions_revoke_MutationOptions({}),
    onSettled: () => setRevokingState({}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessions_search_QueryKeys({ body: body }) }),
    onMutate: ({ query }) => setRevokingState(pv => {
      let newValue = { ...pv };
      query.ids.forEach(id => newValue[id] = true);
      return newValue;
    }),
    onError: (error) => {
      const { name, message } = normalizeError(error);
      toast.error(name, { description: message });
    },
  });

  const { mutate: revokeAll, isPending: isRevokingAll } = useMutation({
    ...sessions_revokeAll_MutationOptions(),
    onSettled: () => setRevokingState({}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessions_search_QueryKeys({ body: body }) }),
    onMutate: () => setRevokingState(pv => {
      let newValue = { ...pv };
      data?.items
        .filter(item => item.id !== currentSession?.id)
        .forEach(item => newValue[item.id] = true);

      return newValue;
    }),
    onError: (error) => {
      const { name, message } = normalizeError(error);
      toast.error(name, { description: message });
    },
  });

  const onRevokeOthersClick = async () => {
    const isConfirmed = await confirm({
      title: m['components.auth.sessions_card.revoke_others'](),
      description: m['components.auth.sessions_card.revoke_others_confirm'](),
      confirmText: m['common.confirm'](),
      cancelText: m['common.cancel'](),
    });

    if (!isConfirmed)
      return;

    revokeAll({});
  }


  const isMutationInProgress = isRevoking || isRevokingAll;

  if (!currentSession)
    return null;

  return (
    <Card className={cn('relative', className)}>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center text-xl">
          <h3>{m['components.auth.sessions_card.title']()}</h3>
        </CardTitle>

        <CardDescription>
          {m['components.auth.sessions_card.description']()}
        </CardDescription>

        <CardAction>
          <LoadingButton
            size="icon-sm"
            variant="ghost"
            className="shadow-none"
            loading={isFetching}
            disabled={isMutationInProgress}
            hideText
            onClick={() => refetch()}
          >
            <RotateCw/>
          </LoadingButton>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-2">
        {isPending ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Fragment key={i}>
              <Skeleton className="h-19.5 rounded-lg"/>
            </Fragment>
          ))
        ) : (
          data?.items.map(((session) => {
            const parser = UAParser(session.userAgent ?? '');

            return (
              <Fragment key={session.id}>
                <div className="flex flex-row items-start gap-3 border rounded-md p-3">
                  <div
                    className="flex justify-center items-center size-10 rounded-md bg-muted text-muted-foreground mt-0.5">
                    {session.deviceType === 'mobile' ? (
                      <SmartphoneIcon className="size-5"/>
                    ) : (
                      <LaptopIcon className="size-5"/>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {parser.device.model}
                      </span>

                      {session.isCurrent && (
                        <Badge variant="secondary" className="rounded-sm px-1.5 h-4 text-[10px] font-normal">
                          {m['components.auth.sessions_card.current']()}
                        </Badge>
                      )}
                    </div>

                    {session.userAgent && (
                      <span className="text-xs text-muted-foreground">
                        {parser.os.name && parser.browser.name ? (
                          `${parser.os.name}, ${parser.browser.name}`
                        ) : (
                          session.userAgent || 'Unknown'
                        )}
                      </span>
                    )}

                    <span className="text-xs text-muted-foreground">
                      {session.ipAddress}
                    </span>
                  </div>

                  <LoadingButton
                    hideText
                    size="icon-sm"
                    variant="ghost"
                    disabled={isFetching}
                    loading={revokingState[session.id]}
                    className="relative ms-auto shadow-none text-muted-foreground"
                    onClick={() => revoke({ query: { ids: [session.id] } })}
                  >
                    {session.isCurrent ? <LogOutIcon/> : <XIcon/>}
                    <span className="sr-only">
                      {session.isCurrent ? m['common.sign_out']() : m['common.revoke']()}
                    </span>
                  </LoadingButton>
                </div>
              </Fragment>
            );
          }))
        )}

      </CardContent>

      <CardFooter>
        <LoadingButton
          variant="outline-destructive"
          size={isMobile ? 'sm' : 'default'}
          disabled={isFetching || isMutationInProgress}
          onClick={onRevokeOthersClick}
        >
          {(() => {
            const text = m['components.auth.sessions_card.revoke_others']();

            return (
              <>
                {(!isMobile || text.length < 18) && <TrashIcon/>}
                <span>{text}</span>
              </>
            );
          })()}
        </LoadingButton>

        <div className="ml-auto flex gap-2">
          <Button
            variant="secondary"
            size={isMobile ? 'icon-sm' : 'icon'}
            disabled={!data || !data.hasPrevPage || isPending || isMutationInProgress}
            onClick={() => setPage(pv => pv - 1)}
          >
            <ChevronLeftIcon/>
          </Button>

          <div
            className={cn(
              'border rounded-md p-2 size-9 flex justify-center items-center',
              isMobile && 'size-8 text-xs'
            )}
          >
            <span>{data?.page ?? 1}</span>
          </div>

          <Button
            size={isMobile ? 'icon-sm' : 'icon'}
            variant="secondary"
            disabled={!data || !data.hasNextPage || isPending || isMutationInProgress}
            onClick={() => setPage(pv => pv + 1)}
          >
            <ChevronRightIcon/>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
