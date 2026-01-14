'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, LoaderIcon } from 'lucide-react';
import { useTheme } from 'better-themes';
import type { CSSProperties } from 'react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      className="toaster group"
      toastOptions={{ classNames: { toast: 'cn-toast' } }}
      theme={theme as ToasterProps['theme']}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
        '--border-radius': 'var(--radius)'
      } as CSSProperties}
      icons={{
        success: <CircleCheckIcon className="size-4"/>,
        info: <InfoIcon className="size-4"/>,
        warning: <TriangleAlertIcon className="size-4"/>,
        error: <OctagonXIcon className="size-4"/>,
        loading: <LoaderIcon className="size-4 animate-spin"/>
      }}
      {...props}
    />
  );
};

export { Toaster };
