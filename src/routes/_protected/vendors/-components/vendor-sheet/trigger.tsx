import { Button } from '@/components/ui/button';
import type { ComponentProps, FC } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { useVendorSheet, type TVendorSheetOptions } from './provider';
import { FilePlusIcon, type LucideIcon } from 'lucide-react';
import { m } from '@/paraglide/messages';


interface IProps
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  options: TVendorSheetOptions;
  text?: string;
  icon?: LucideIcon;
}


export const VendorSheetTrigger: FC<IProps> = (props) => {
  const {
    children,
    asChild,
    options,
    text = m['common.create'](),
    icon: Icon = FilePlusIcon,
    ...btnProps
  } = props;

  const { open } = useVendorSheet();
  const isMobile = useIsMobile();

  const button = (
    <Button
      {...btnProps}
      asChild={asChild}
      onClick={() => open(options)}
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