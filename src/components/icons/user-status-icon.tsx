import { AdminUserStatus } from '@/api/generated';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { CircleCheckIcon, CircleQuestionMarkIcon, CircleXIcon } from 'lucide-react';

interface IUserStatusIconProps {
  status: AdminUserStatus | string | undefined | null;
  className?: string;
}

export const UserStatusIcon: FC<IUserStatusIconProps> = (props) => {
  const className = cn(props.className);
  const Icon = getUserStatusIcon(props.status)

  return <Icon className={className}/>
}

export function getUserStatusIcon(status: AdminUserStatus | string | undefined | null) {
  switch (status) {
    case AdminUserStatus.ACTIVE:
      return CircleCheckIcon;

    case AdminUserStatus.INACTIVE:
      return CircleXIcon;

    default:
      return CircleQuestionMarkIcon;
  }
}