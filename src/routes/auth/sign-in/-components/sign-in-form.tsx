import * as z from 'zod';
import { type ComponentProps, type FC, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { m } from '@/paraglide/messages';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';



export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export type TSignInSchema = z.infer<typeof signInSchema>;

interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TSignInSchema>;
  onSubmit: (data: TSignInSchema) => void;
  disabled?: boolean;
}

export const SignInForm: FC<IProps> = ({ form, id, onSubmit, disabled, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <form
      id={id ?? 'sign-in-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      method="post"
      {...props}
    >
      <fieldset disabled={disabled}>
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email-input">
                  {m['common.email']()}
                </FieldLabel>
                <Input
                  {...field}
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="johndoe@yahoo.com"
                />
                {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="password-input">
                    {m['common.password']()}
                  </FieldLabel>
                </div>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="password-input"
                    autoComplete="current-password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    aria-invalid={fieldState.invalid}
                    placeholder="*********"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton size="icon-xs" onClick={() => setIsPasswordVisible(pv => !pv)}>
                      {isPasswordVisible ? <EyeIcon/> : <EyeOffIcon/>}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
              </Field>
            )}
          />
        </FieldGroup>
      </fieldset>
    </form>
  );
};