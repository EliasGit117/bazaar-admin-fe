import * as z from 'zod';
import type { ZodType } from 'zod';
import {
  AdminUserRole,
  AdminUserStatus,
  type CreateAdminUserDto,
  type UpdateAdminUserDto
} from '@/api/generated';


export const createUserSchema = z.object({
  email: z.email(),
  role: z.enum(AdminUserRole),
  status: z.enum(AdminUserStatus),
  firstName: z.string().trim().min(2).max(64),
  lastName: z.string().trim().min(2).max(64),
  password: z.string().trim().min(5).max(124)
}) satisfies ZodType<CreateAdminUserDto>;

export type TCreateUser = z.infer<typeof createUserSchema>;


export const updateUserSchema = createUserSchema.extend({
  password: z.string().trim().max(124).optional()
}) satisfies ZodType<UpdateAdminUserDto>;

export type TUpdateUser = z.infer<typeof updateUserSchema>;