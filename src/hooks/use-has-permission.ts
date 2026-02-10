import type { RolePermissionsDto } from '@/api/generated';
import { useAuth } from '@/providers/auth.tsx';
import { hasPermission } from '@/lib/utils/has-permission.ts';

export const useHasPermission = <K extends keyof RolePermissionsDto>(
  resource: K,
  action: RolePermissionsDto[K][number],
): boolean => {
  const { permissions } = useAuth();
  return hasPermission(permissions ?? undefined, resource, action);
};