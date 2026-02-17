import type { RolePermissionsDto } from '@/api/generated';

export const hasPermission = <K extends keyof RolePermissionsDto>(
  permissions: RolePermissionsDto | undefined | null,
  resource: K,
  action: RolePermissionsDto[K][number],
): boolean => {

  if (!permissions)
    return false;

  const permissionsForResource = permissions[resource] as readonly RolePermissionsDto[K][number][];

  return permissionsForResource.includes(action);
};