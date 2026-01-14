import { type ComponentProps, type FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LaptopIcon, type LucideIcon, MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'better-themes';
import { m } from '@/paraglide/messages';


interface IProps extends ComponentProps<typeof Button> {
  align?: 'start' | 'center' | 'end';
}

const themeOptions: { label: string; value: string; icon: LucideIcon; }[] = [
  { label: m['components.theme_dropdown.light'](), value: 'light', icon: SunIcon },
  { label: m['components.theme_dropdown.dark'](), value: 'dark', icon: MoonIcon },
  { label: m['components.theme_dropdown.system'](), value: 'system', icon: LaptopIcon }
];

export const ThemeDropdown: FC<IProps> = ({ align, ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" {...props}>
          <SunIcon className="dark:hidden"/>
          <MoonIcon className="hidden dark:block"/>
          <span className="sr-only">
            {m['components.theme_dropdown.title']()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-40 w-full" align={align}>
        <DropdownMenuRadioGroup value={theme}>
          <DropdownMenuLabel className="flex gap-2 items-center">
            <SunMoonIcon className="size-4"/>
            <span>
              {m['components.theme_dropdown.title']()}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator/>

          {themeOptions.map(({ icon: Icon, label, value }) =>
            <DropdownMenuRadioItem value={value} onClick={() => setTheme(value)} key={value}>
              <Icon className="text-muted-foreground"/>
              <span>{label}</span>
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

    </DropdownMenu>
  );
};
