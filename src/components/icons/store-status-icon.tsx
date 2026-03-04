import { StoreStatus } from '@/api/generated';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { ArchiveIcon, CircleCheckIcon, CirclePauseIcon, CircleQuestionMarkIcon, CircleXIcon } from 'lucide-react';

interface IStoreStatusIconProps {
  status: StoreStatus | string | undefined | null;
  className?: string;
}

export const StoreStatusIcon: FC<IStoreStatusIconProps> = (props) => {
  const className = cn(props.className);
  const Icon = getStoreStatusIcon(props.status);

  return <Icon className={className}/>;
};

export function getStoreStatusIcon(status: StoreStatus | string | undefined | null) {
  switch (status) {
    case StoreStatus.DRAFT:
      return CirclePauseIcon;

    case StoreStatus.ACTIVE:
      return CircleCheckIcon;

    case StoreStatus.INACTIVE:
      return CircleXIcon;

    case StoreStatus.ARCHIVED:
      return ArchiveIcon;

    default:
      return CircleQuestionMarkIcon;
  }
}