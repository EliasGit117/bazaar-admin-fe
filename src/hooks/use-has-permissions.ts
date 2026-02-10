import type { RolePermissionsDto } from '@/api/generated';
import { useAuth } from '@/providers/auth.tsx';
import { hasPermission } from '@/lib/utils/has-permission.ts';


export const useHasPermissions = <T extends Record<string, Partial<{ [K in keyof RolePermissionsDto]: RolePermissionsDto[K][number]; }>>>(requirements: T,): { [K in keyof T]: boolean } => {
  const { permissions } = useAuth();
  const result = {} as { [K in keyof T]: boolean };

  for (const key in requirements) {
    const requirement = requirements[key];
    let allowed = true;

    for (const resource in requirement) {
      const action = requirement[resource as keyof typeof requirement] as RolePermissionsDto[keyof RolePermissionsDto][number];

      if (!hasPermission(permissions ?? undefined, resource as keyof RolePermissionsDto, action,)) {
        allowed = false;
        break;
      }
    }

    result[key] = allowed;
  }

  return result;
};