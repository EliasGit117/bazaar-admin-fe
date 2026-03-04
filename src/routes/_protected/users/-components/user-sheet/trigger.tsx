import { Button, buttonVariants } from '@/components/ui/button';
import type { ComponentProps, FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserSheet, type TUserSheetOptions } from './provider';
import { FilePlusIcon, type LucideIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';


interface IProps
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  options: TUserSheetOptions;
  text?: string;
  icon?: LucideIcon;
  tooltipAlign?: 'center' | 'end' | 'start';
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}

const sizeClassNames: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, string> = {
  lg: 'w-10',
  default: 'w-9',
  sm: 'w-8',
  xs: 'w-6',
  'icon-lg': '',
  icon: '',
  'icon-sm': '',
  'icon-xs': '',
  dense: ''
};


export const UserSheetTrigger: FC<IProps> = (props) => {
  const {
    children,
    asChild,
    options,
    text = m['common.create'](),
    icon: Icon = FilePlusIcon,
    size,
    className,
    tooltipSide,
    tooltipAlign,
    ...btnProps
  } = props;

  const { open } = useUserSheet();
  const isMobile = useIsMobile();

  const button = (
    <Button
      size={size}
      asChild={asChild}
      onClick={() => open(options)}
      className={cn(sizeClassNames[size ?? 'default'], 'sm:w-fit', className)}
      {...btnProps}
    >
      {asChild && children ? children : (
        <>
          <Icon />
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Button>
  );

  if (!isMobile)
    return button;

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};