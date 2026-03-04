import {
  type LucideIcon,
  ChevronRight,
  ChevronsUpDown,
  UserIcon,
  SunIcon,
  MoonIcon,
  SunMoonIcon,
  MonitorIcon,
  LanguagesIcon,
  UsersIcon,
  UserSearchIcon,
  SquareUserIcon,
  StoreIcon,
  HandshakeIcon,
  LogOutIcon,
  CogIcon,
  MonitorCogIcon
} from 'lucide-react';
import { useHasPermissions } from '@/hooks/use-has-permissions.ts';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  sidebarMenuButtonVariants, SidebarGroupContent
} from '@/components/ui/sidebar';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import type { VariantProps } from 'class-variance-authority';
import type { LinkOptions } from '@tanstack/router-core';
import { Link, useLocation } from '@tanstack/react-router';
import { getLocale, type Locale, setLocale } from '@/paraglide/runtime';
import { useTheme } from 'better-themes';
import { cn, envConfig } from '@/lib/utils';
import { useAuth } from '@/providers/auth.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';
import { LogoSmall } from '@/components/icons';
import { m } from '@/paraglide/messages';
import { AdminUserStatus } from '@/api/generated';


interface INavItem {
  title: string;
  linkOptions: LinkOptions;
  icon?: LucideIcon;
}

interface ISidebarMenuItem {
  title: string;
  linkOptions?: LinkOptions;
  icon?: LucideIcon;
  items?: INavItem[];
}


export const AppSidebar: FC<ComponentPropsWithoutRef<typeof Sidebar>> = ({ ...props }) => {
  const { setOpenMobile } = useSidebar();
  const navMain = useNavMain();


  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" onClick={() => setOpenMobile(false)}>
                <div className="bg-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LogoSmall logoClassName="fill-primary-foreground"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{envConfig.appName}</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavSidebarGroup label={m['components.sidebar.main']()} items={navMain}/>
        <div className="flex-1"/>
      </SidebarContent>

      <SidebarFooter>
        <NavPreferences itemsSize="sm" className="px-1"/>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
};

interface INavSidebarGroupProps extends ComponentPropsWithoutRef<typeof SidebarGroup> {
  label?: string;
  items: ISidebarMenuItem[];
  itemsSize?: VariantProps<typeof sidebarMenuButtonVariants>['size'];
}

const sidebarMenuSubButtonSizes: Record<
  NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['size']>,
  ComponentPropsWithoutRef<typeof SidebarMenuSubButton>['size']
> = {
  default: 'md',
  sm: 'sm',
  lg: 'md'
};

const NavSidebarGroup: FC<INavSidebarGroupProps> = ({ label, items, itemsSize, ...props }) => {
  const { setOpenMobile } = useSidebar();
  const { pathname } = useLocation({ select: (state) => ({ pathname: state.pathname }) });

  const filteredItems = items.filter(item => (item.linkOptions || item.items?.length));
  if (!filteredItems.length)
    return null;

  return (
    <SidebarGroup {...props}>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveChild = item.items?.some((sub) => sub.linkOptions.to === pathname) ?? false;

          return (
            <Collapsible key={item.title} defaultOpen={hasActiveChild} className="group/collapsible" asChild>
              <SidebarMenuItem>
                {!!item.linkOptions ? (
                  <>
                    <SidebarMenuButton
                      tooltip={item.title}
                      size={itemsSize}
                      onClick={() => setOpenMobile(false)}
                      asChild
                    >
                      <Link
                        {...item.linkOptions}
                        activeProps={{ 'data-active': true }}
                      >
                        {item.icon && <item.icon/>}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {(!!item.items && item.items.length > 0) && (
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="group">
                          <ChevronRight className="group-data-[state=open]:rotate-90 transition-transform"/>
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                    )}
                  </>
                ) : (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon/>}
                      <span>{item.title}</span>
                      {(!!item.items && item.items.length > 0) && (
                        <ChevronRight
                          className={cn(
                            'ml-auto transition-transform duration-200',
                            'group-data-[state=open]/collapsible:rotate-90'
                          )}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                )}
                {(!!item.items && item.items?.length > 0) && (
                  <>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton size={sidebarMenuSubButtonSizes[itemsSize ?? 'default']} asChild>
                              <Link
                                {...subItem.linkOptions}
                                activeProps={{ 'data-active': true }}
                                onClick={() => setOpenMobile(false)}
                              >
                                {subItem.icon && <subItem.icon className="text-muted-foreground! size-3.5!"/>}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};


const NavUser: FC<ComponentPropsWithoutRef<typeof SidebarMenu>> = ({ ...props }) => {
  const { isMobile } = useSidebar();
  const { user, isSigningOut, signOut } = useAuth();

  if (!user)
    return null;

  return (
    <SidebarMenu {...props}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              disabled={isSigningOut}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="size-8 rounded-lg bg-muted border flex items-center justify-center">
                <UserIcon className="size-4 text-muted-foreground"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              {!isSigningOut ? (
                <ChevronsUpDown className="ml-auto size-4"/>
              ) : (
                <Spinner/>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="size-8 rounded-lg bg-muted border flex items-center justify-center">
                  <UserIcon className="size-4 text-muted-foreground"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight text-foreground">
                  <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator/>

            <DropdownMenuItem asChild>
              <Link to="/settings">
                <CogIcon/>
                <span>{m['common.settings']()}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator/>

            <DropdownMenuItem variant="destructive" onClick={signOut}>
              {isSigningOut ? <Spinner/> : <LogOutIcon/>}
              <span>{isSigningOut ? m['common.loading']() : m['common.sign_out']()}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};


const localeOptions: { value: Locale; title: string; }[] = [
  { title: 'English', value: 'en' },
  { title: 'Romana', value: 'ro' },
  { title: 'Русский', value: 'ru' }
];

const languageTitles: Record<Locale, string> = { en: 'Language', ro: 'Limba', ru: 'Язык' };
const themeTitles: Record<Locale, string> = { en: 'Theme', ro: 'Tema', ru: 'Тема' };

const systemTitles: Record<Locale, string> = { en: 'System', ro: 'Sistemǎ', ru: 'Системная' };
const lightTitles: Record<Locale, string> = { en: 'Light', ro: 'Luminoasǎ', ru: 'Светлая' };
const darkTitles: Record<Locale, string> = { en: 'Dark', ro: 'Întunericǎ', ru: 'Тёмная' };

interface INavPreferencesProps extends ComponentPropsWithoutRef<typeof SidebarGroup> {
  itemsSize?: VariantProps<typeof sidebarMenuButtonVariants>['size'];
}

const preferencesTitles: Record<Locale, string> = { en: 'Preferences', ro: 'Preferințe', ru: 'Предпочтения' };

const NavPreferences: FC<INavPreferencesProps> = ({ itemsSize, ...props }) => {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const locale = getLocale();

  const themeOptions: { value: string; title: string; icon: LucideIcon; }[] = [
    { title: systemTitles[locale], value: 'system', icon: MonitorIcon },
    { title: lightTitles[locale], value: 'light', icon: SunIcon },
    { title: darkTitles[locale], value: 'dark', icon: MoonIcon }
  ];

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{preferencesTitles[locale]}</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={itemsSize}>
                  <SunMoonIcon/>
                  <span>{themeTitles[locale]}</span>
                  <SunIcon className="text-muted-foreground dark:hidden ml-auto"/>
                  <MoonIcon className="text-muted-foreground hidden dark:block ml-auto"/>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={cn('w-(--radix-dropdown-menu-trigger-width) rounded-lg', !isMobile && 'max-w-44')}
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={theme}>
                  <DropdownMenuLabel className="flex gap-2 items-center">
                    <SunMoonIcon className="size-4"/>
                    <span>{themeTitles[locale]}</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  {themeOptions.map(item => (
                    <DropdownMenuRadioItem
                      value={item.value}
                      onClick={() => setTheme(item.value)}
                      key={item.value}
                    >
                      {item.icon && <item.icon className="text-muted-foreground"/>}
                      <span>{item.title}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={itemsSize}>
                  <LanguagesIcon/>
                  <span>{languageTitles[locale]}</span>
                  <span className="ml-auto text-muted-foreground uppercase text-xs">
                    {locale}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className={cn('w-(--radix-dropdown-menu-trigger-width) rounded-lg', !isMobile && 'max-w-44')}
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup value={locale}>
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <LanguagesIcon className="size-4"/>
                    <span>{languageTitles[locale]}</span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator/>

                  {localeOptions.map(({ value, title }) =>
                    <DropdownMenuRadioItem key={value} value={value} className="gap-4" onClick={() => setLocale(value)}>
                      <span className="text-xs uppercase text-muted-foreground">
                        {value}
                      </span>
                      <span>{title}</span>
                    </DropdownMenuRadioItem>
                  )}

                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};


const useNavMain = () => {
  const permissions = useHasPermissions({
    canListVendors: { vendors: 'list' },
    canListStores: { stores: 'list' },

    canListSessions: { sessions: 'list' },
    canListUsers: { users: 'list' }
  });

  const businessesGroup: ISidebarMenuItem = {
    icon: HandshakeIcon,
    title: m['components.sidebar.businesses'](),
    items: []
  };

  if (permissions.canListVendors)
    businessesGroup.items?.push({
      icon: SquareUserIcon,
      title: m['components.sidebar.vendors'](),
      linkOptions: { to: '/vendors', activeOptions: { includeSearch: false } }
    });

  if (permissions.canListStores)
    businessesGroup.items?.push({
      icon: StoreIcon,
      title: m['components.sidebar.stores'](),
      linkOptions: { to: '/stores', activeOptions: { includeSearch: false } }
    });

  const usersGroup: ISidebarMenuItem = {
    icon: UsersIcon,
    title: m['components.sidebar.users'](),
    items: []
  };

  if (permissions.canListUsers)
    usersGroup.items?.push({
      icon: UserSearchIcon,
      title: m['common.list'](),
      linkOptions: { to: '/users', activeOptions: { includeSearch: false } }
    });

  if (permissions.canListSessions)
    usersGroup.items?.push({
      icon: MonitorCogIcon,
      title: m['components.sidebar.sessions'](),
      linkOptions: { to: '/sessions', search: { status: [AdminUserStatus.ACTIVE] }, activeOptions: { includeSearch: false } }
    });

  return [
    businessesGroup,
    usersGroup
  ];
};