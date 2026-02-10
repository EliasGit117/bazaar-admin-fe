import type { ComponentProps, FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/layout/app-sidebar.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import './app-sidebar.tsx';
import { Footer } from '@/components/layout/footer.tsx';
import { NavBreadcrumbs } from '@/components/layout/nav-breadcrumb.tsx';


interface IProps extends ComponentProps<'div'> {
  children?: ReactNode;
}

export const AppLayout: FC<IProps> = ({ children, className, ...divProps }) => {

  return (
    <SidebarProvider>
      <AppSidebar/>

      <SidebarInset className="min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="container mx-auto p-4 flex items-center gap-2">
            <SidebarTrigger className="-ml-1 sm:-ml-2"/>
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4 my-auto"/>
            <NavBreadcrumbs className='ml-1.5'/>
          </div>
        </header>

        <div
          className={cn("container mx-auto px-4 flex flex-col flex-1 gap-4", className)}
          {...divProps}
        >
          {children}
          <Footer className='mt-auto px-0'/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};