import type { ComponentProps, FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils';
import { SignInForm, signInSchema, type TSignInSchema } from '@/routes/auth/sign-in/-components/sign-in-form.tsx';
import { useForm } from 'react-hook-form';
import { m } from '@/paraglide/messages';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-button.tsx';


interface ISignInCard extends ComponentProps<typeof Card> {
}

export const SignInCard: FC<ISignInCard> = ({ className, ...props }) => {
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = () => {

  }

  const isPending = false;

  return (
    <Card className={cn('w-full max-w-sm', className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-left">
          {m['pages.auth.sign_in.form.title']()}
        </CardTitle>
        <CardDescription className='text-left'>
          {m['pages.auth.sign_in.form.description']()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignInForm form={form} onSubmit={onSubmit} disabled={isPending} id="sign-in-form"/>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <LoadingButton className="w-full" loading={isPending} form="sign-in-form">
          <SendIcon/>
          <span>{m['common.submit']()}</span>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};