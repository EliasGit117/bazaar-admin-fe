import type { ComponentProps, FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Button, buttonVariants } from '@/components/ui/button.tsx';
import type { VariantProps } from 'class-variance-authority';
import { getLocale, setLocale, type Locale } from '@/paraglide/runtime';
import { m } from '@/paraglide/messages';
import { cn } from '@/lib/utils';
import { ChevronsUpDownIcon, LanguagesIcon } from 'lucide-react';


interface IProps extends ComponentProps<typeof DropdownMenuTrigger> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
  align?: 'start' | 'center' | 'end';
  mode?: 'adaptive' | 'icon';
}

const localeOptions: { value: Locale; title: string; }[] = [
  { value: 'en', title: 'English' },
  { value: 'ro', title: 'Romana' },
  { value: 'ru', title: 'Русский' },
];

export const LocaleDropdown: FC<IProps> = ({ mode = 'adaptive', variant, align, className, ...props }) => {
  const locale = getLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size='sm'
          className={cn(mode === 'icon' ? 'w-8' : 'w-8 sm:w-fit')}
          {...props}
        >
          <span className={cn('uppercase', mode === 'adaptive' && 'sm:hidden')}>
            {locale}
          </span>

          {mode === 'adaptive' && (
            <>
              <LanguagesIcon className="hidden sm:block opacity-65"/>
              <span className="hidden sm:block">
                {localeOptions.find(item => item.value === locale)?.title}
              </span>
              <ChevronsUpDownIcon className="hidden sm:block opacity-65"/>
            </>
          )}

          <span className="sr-only">
            {m['components.locale_dropdown.title']()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-36 w-full" align={align}>
        <DropdownMenuLabel className="flex items-center gap-2">
          <LanguagesIcon className="size-4"/>
          <span>{m['components.locale_dropdown.title']()}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator/>

        <DropdownMenuRadioGroup value={locale}>
          {localeOptions.map(({ value, title }) =>
            <DropdownMenuRadioItem key={value} value={value} onClick={() => setLocale(value)}>
              <span className="text-xs uppercase text-muted-foreground">
                {value}
              </span>
              <span>{title}</span>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

