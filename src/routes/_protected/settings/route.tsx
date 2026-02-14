import { createFileRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { getLocale, type Locale } from '@/paraglide/runtime';
import type { LinkOptions } from '@tanstack/router-core';
import { LockIcon, type LucideIcon, UserCircleIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';



const locale = getLocale();
const titleTranslations: Record<Locale, string> = { en: 'Settings', ro: 'Setări', ru: 'Настройки' };
const profileTitleTranslations: Record<Locale, string> = { en: 'Profile', ro: 'Profilul', ru: 'Профиль' };
const securityTitleTranslations: Record<Locale, string> = { en: 'Security', ro: 'Securitate', ru: 'Безопасность' };
const title = titleTranslations[locale];

export const Route = createFileRoute('/_protected/settings')({
  staticData: { crumbs: { title: title } },
  head: () => ({ meta: [{ title: title }] }),
  beforeLoad: ({ location }) => {
    if (location.pathname === '/settings')
      throw redirect({ to: '/settings/profile' });
  },
  component: RouteLayout
});

function RouteLayout() {
  const location = useLocation();
  const tabOptions: { name: string; icon: LucideIcon, linkOptions: LinkOptions }[] = [
    { name: profileTitleTranslations[locale], icon: UserCircleIcon, linkOptions: { to: '/settings/profile' } },
    { name: securityTitleTranslations[locale], icon: LockIcon, linkOptions: { to: '/settings/security' } },
  ];

  return (
    <>
      <nav>
      <Tabs value={location.pathname}>
        <TabsList className='grid grid-cols-2 w-full sm:w-fit gap-1 sm:-ml-0.5'>
          {tabOptions.map((option) => (
            <TabsTrigger key={option.name} value={option.linkOptions.to ?? ''} className='sm:min-w-42' asChild>
              <Link {...option.linkOptions}>
                <option.icon className='size-3.5 sm:size-4'/>
                <span className='text-xs sm:text-sm'>{option.name}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      </nav>
      <Outlet/>
    </>
  )
}

