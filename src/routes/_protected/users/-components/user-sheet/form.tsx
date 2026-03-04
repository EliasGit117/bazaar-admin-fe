import { type ComponentProps, type FC, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronsUpDownIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import {
  AdminUserRole,
  AdminUserStatus
} from '@/api/generated';
import type {
  TCreateUser,
  TUpdateUser
} from './schemas';
import { m } from '@/paraglide/messages';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { UserStatusIcon } from '@/components/icons/user-status-icon.tsx';
import { UserRoleIcon } from '@/components/icons';


interface IProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  id?: string;
  form: UseFormReturn<TCreateUser | TUpdateUser>;
  onSubmit: (data: TCreateUser | TUpdateUser) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const UserForm: FC<IProps> = ({ id = 'user-form', form, onSubmit, disabled, loading, ...formProps }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (loading)
    return (
      <form id={id} {...formProps}>
        <LoadingSkeleton/>
      </form>
    );


  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} {...formProps}>
      <fieldset disabled={disabled}>
        <FieldGroup className="grid grid-cols-2 gap-4">

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <FieldLabel>{m['common.email']()}</FieldLabel>
                <Input {...field} placeholder="alex.mason@icloud.com" autoComplete="nope"/>
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{m['common.first_name']()}</FieldLabel>
                <Input placeholder="Alex" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{m['common.last_name']()}</FieldLabel>
                <Input placeholder="Mason" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
              </Field>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>{m['common.role']()}</FieldLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <UserRoleIcon role={field.value} className='text-muted-foreground'/>
                      <span>{m[`roles.${field.value}`] ? m[`roles.${field.value}`]() : field.value}</span>
                      <ChevronsUpDownIcon className="h-4 w-4 opacity-50 ml-auto"/>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                      {Object.values(AdminUserRole).map(role => (
                        <DropdownMenuRadioItem key={role} value={role}>
                          <UserRoleIcon role={field.value} className='text-muted-foreground'/>
                          <span>{m[`roles.${role}`]?.() ?? role}</span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>
            )}
          />

          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>{m['common.status']()}</FieldLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <UserStatusIcon status={field.value} className='text-muted-foreground'/>
                      <span>{m[`common.${field.value}`] ? m[`common.${field.value}`]() : field.value}</span>
                      <ChevronsUpDownIcon className="h-4 w-4 opacity-50 ml-auto"/>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                      {Object.values(AdminUserStatus).map(status => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          <UserStatusIcon status={field.value} className='text-muted-foreground'/>
                          <span>{m[`common.${status}`]?.() ?? status}</span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="col-span-full">
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="new-password-input">
                    {m['common.password']()}
                  </FieldLabel>
                </div>

                <InputGroup>
                  <InputGroupInput
                    {...field}
                    autoComplete="new-password"
                    id="new-password-input"
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

const LoadingSkeleton: FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Email */}
      <div className="col-span-full">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* First name */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Last name */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Role */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Status */}
      <div className="col-span-full sm:col-span-1">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>

      {/* Password */}
      <div className="col-span-full">
        <Skeleton className="mb-2 h-4 w-full max-w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>
    </div>
  );
};
