import { type FC, useEffect } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { FilePlusCornerIcon, SaveIcon, XIcon } from 'lucide-react';
import { useUserSheet, UserSheetMode } from './provider';
import {
  createUserSchema,
  updateUserSchema,
  type TCreateUser,
  type TUpdateUser
} from './schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  type AdminUserDto,
  AdminUserRole,
  AdminUserStatus
} from '@/api/generated';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  users_get_byId_QueryOptions, users_patch_byId_MutationOptions, users_post_index_MutationOptions
} from '@/api/generated/@tanstack/react-query.gen';
import { UserForm } from './form';
import { normalizeError } from '@/lib/utils';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages';


interface IProps {
  onSuccess?: () => void;
}

export const UserSheet: FC<IProps> = ({ onSuccess }) => {
  const { isOpen, options, close } = useUserSheet();

  const mode = options?.mode;
  const userId: number = (options?.mode === UserSheetMode.Update ? options.userId : null) ?? -1;

  const form = useForm<TCreateUser | TUpdateUser>({
    resolver: zodResolver(mode === UserSheetMode.Create ? createUserSchema : updateUserSchema),
    defaultValues: getFormValues()
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    ...users_get_byId_QueryOptions({ path: { id: userId } }),
    enabled: mode === UserSheetMode.Update && options?.userId != null,
    staleTime: 0,
    gcTime: 0
  });

  const onMutationSuccess = () => {
    onSuccess?.();
    close();
  };

  const onMutationError = (error: unknown) => {
    const { name, message } = normalizeError(error);
    toast.error(name, { description: message });
  };

  const { mutate: create, isPending: isCreating } = useMutation({
    ...users_post_index_MutationOptions(),
    onSuccess: onMutationSuccess,
    onError: onMutationError
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    ...users_patch_byId_MutationOptions(),
    onSuccess: onMutationSuccess,
    onError: onMutationError
  });

  const onOpenChange = (v: boolean) => {
    if (isCreating || isUpdating || v)
      return;

    close();
  };

  const onSubmit = (values: TCreateUser | TUpdateUser) => {
    if (mode === UserSheetMode.Create) {
      const createParseRes = createUserSchema.safeParse(values);
      if (!createParseRes.success) {
        console.error(createParseRes.error);
        return;
      }

      create({ body: createParseRes.data });
      return;
    }

    if (userId < 1) {
      console.error(`Invalid for submit user id: ${userId}`);
      return;
    }

    const cleanedValues = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== ''));
    update({ path: { id: userId }, body: cleanedValues });
  };

  useEffect(() => {
    if (!isOpen)
      return;

    if (mode === UserSheetMode.Create || user == null) {
      form.reset(getFormValues());
      return;
    }

    form.reset(getFormValues(user));
  }, [isOpen, mode, user]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full! max-w-full! sm:max-w-full! md:max-w-xl! gap-0 border-l-0! md:border-l!"
        showCloseButton={false}
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            {mode === UserSheetMode.Update ? 'Edit user' : 'Create user'}
          </SheetTitle>

          <SheetDescription>
            {mode === UserSheetMode.Update ? 'Update user information.' : 'Create a new user.'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto mr-2 my-2" type="always">
          <UserForm
            id="user-form"
            form={form}
            className="px-4"
            loading={isLoadingUser}
            disabled={isCreating || isUpdating}
            onSubmit={onSubmit}
          />
        </ScrollArea>

        <SheetFooter className="flex flex-col sm:flex-row gap-4 justify-between items-end pt-0">
          <div className="flex flex-row sm:justify-end gap-2 w-full">
            <SheetClose className="grow sm:grow-0 sm:min-w-32" asChild>
              <Button variant="outline" disabled={isCreating || isUpdating}>
                <XIcon/>
                <span>{m['common.close']()}</span>
              </Button>
            </SheetClose>

            <LoadingButton
              form="user-form"
              className="grow sm:min-w-32 sm:grow-0"
              disabled={isLoadingUser}
              loading={isCreating || isUpdating}
            >
              {mode === UserSheetMode.Create ? <FilePlusCornerIcon/> : <SaveIcon/>}
              <span>{mode === UserSheetMode.Create ? m['common.create']() : m['common.save']()}</span>
            </LoadingButton>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

function getFormValues(user?: AdminUserDto): TCreateUser | TUpdateUser {
  return {
    email: user?.email ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    role: user?.role ?? AdminUserRole.USER,
    status: user?.status ?? AdminUserStatus.ACTIVE,
    password: ''
  };
}