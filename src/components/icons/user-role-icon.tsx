import { AdminUserRole } from '@/api/generated';
import {
  UserIcon,
  UserSearchIcon,
  UserStarIcon
} from 'lucide-react';
import type { FC } from 'react';
import { cn } from '@/lib/utils/cn.ts';


interface IUserRoleIcon {
  role: AdminUserRole | string | undefined | null;
  className?: string;
}

export const UserRoleIcon: FC<IUserRoleIcon> = (props) => {
  const className = cn(props.className);
  const Icon = getUserRoleIcon(props.role);

  return <Icon className={className}/>
}

export function getUserRoleIcon(role: AdminUserRole | string | undefined | null) {

  switch (role) {
    case AdminUserRole.ADMIN:
      return UserStarIcon;

    case AdminUserRole.USER:
      return UserIcon;

    case AdminUserRole.MANAGER:
      return UserSearchIcon;

    default:
      return UserIcon;
  }
}