import { type ComponentProps, type FC, type PropsWithChildren, useRef } from 'react';
import { cn, envConfig } from '@/lib/utils';
import BgFirst from '@/assets/auth/bg-1.svg?react';
import BgSecond from '@/assets/auth/bg-2.svg?react';
import BgThird from '@/assets/auth/bg-3.svg?react';
import BgFourth from '@/assets/auth/bg-4.svg?react';
import { ThemeDropdown } from '@/components/theme';
import { Link } from '@tanstack/react-router';
import { LocaleDropdown } from '@/components/locale';
import { Footer } from '@/components/layout';
import { LogoSmall } from '@/components/icons';
import { LogoText } from '@/components/icons/logo-text.tsx';


export const AuthLayout: FC<PropsWithChildren<ComponentProps<'div'>>> = ({ className, children, ...props }) => {
  const background = useRef(backgrounds[getRandom0to3()]);

  return (
    <div className={cn('grid lg:grid-cols-2 relative', className)} {...props}>
      <div className="flex flex-col gap-4 p-6 pb-0 relative">
        <div className="flex gap-2">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <LogoSmall className="size-6"/>
            <LogoText className="h-5"/>
            <span className="sr-only">{envConfig.appName}</span>
          </Link>

          <div className="flex-1"/>

          <LocaleDropdown variant="ghost" align="end"/>
          <ThemeDropdown size="icon-sm" variant="ghost" align="end"/>
        </div>

        <div className="flex flex-col flex-1">
          {children}
          <Footer className="mt-auto px-0 mx-auto sm:mx-0"/>
        </div>
      </div>


      <div className="bg-muted relative hidden lg:block border-l overflow-hidden">
        {<background.current className="text-primary scale-y-105"/>}
      </div>
    </div>
  );
};

const getRandom0to3 = (): number => Math.floor(Math.random() * 4);
const backgrounds = [
  BgFirst,
  BgSecond,
  BgThird,
  BgFourth
];
