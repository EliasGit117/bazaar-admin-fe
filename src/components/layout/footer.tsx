import type { ComponentProps, FC } from 'react';
import { m } from '@/paraglide/messages';
import { cn } from '@/lib/utils';


interface IProps extends ComponentProps<'footer'> {
}

export const Footer: FC<IProps> = ({ className, ...footerProps }) => {

  return (
    <footer className={cn("flex items-center p-4 text-muted-foreground", className)} {...footerProps}>
      <p className='text-xs'>
        {m['components.footer.text']({
          year: new Date().getFullYear(),
          name: import.meta.env.VITE_APP_NAME ?? 'Website Name'
        })}
      </p>
    </footer>
  );
};