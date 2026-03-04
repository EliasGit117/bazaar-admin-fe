import * as z from 'zod';
import type { ZodType } from 'zod';
import {
  StoreStatus,
  type CreateStoreDto,
} from '@/api/generated';



export const createStoreSchema = z.object({
  name: z.string().trim().min(2).max(255),
  slug: z.string().trim().min(2).max(255),
  status: z.enum(StoreStatus),
  shortDescriptionEn: z.string(),
  shortDescriptionRo: z.string(),
  shortDescriptionRu: z.string(),
  vendorId: z.number().min(1),
  tags: z.array(z.string()).optional()
}) satisfies ZodType<CreateStoreDto>;

export type TCreateStore = z.infer<typeof createStoreSchema>;

