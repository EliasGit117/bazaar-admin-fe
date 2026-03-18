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


type TButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;
type TButtonValidSize = Extract<TButtonSize, 'lg' | 'default' | 'sm' | 'xs'>

interface IProps extends ComponentProps<typeof DropdownMenuTrigger> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: TButtonValidSize;
  align?: 'start' | 'center' | 'end';
  mode?: 'icon' | 'adaptive';
}

const localeOptions: { value: Locale; title: string; }[] = [
  { value: 'en', title: 'English' },
  { value: 'ro', title: 'Romana' },
  { value: 'ru', title: 'Русский' }
];

const sizeClassNames: Record<TButtonValidSize, string> = {
  default: 'w-9',
  lg: 'w-10',
  sm: 'w-8',
  xs: 'w-6'
};

export const LocaleDropdown: FC<IProps> = (props) => {
  const {
    size = 'default',
    mode = 'adaptive',
    variant,
    align,
    className,
    ...btnProps
  } = props;
  const locale = getLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(mode === 'icon' ? sizeClassNames[size] : [sizeClassNames[size], 'sm:w-fit'])}
          {...btnProps}
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

