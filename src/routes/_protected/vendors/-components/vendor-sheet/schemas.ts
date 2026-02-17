import * as z from 'zod';
import type { ZodType } from 'zod';
import { type CreateVendorDto, CurrencyCode, type UpdateVendorDto, VendorType } from '@/api/generated';
import { m } from '@/paraglide/messages';


const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

export const createVendorSchema = z.object({
  type: z.enum(VendorType),
  currency: z.enum(CurrencyCode),
  ownerId: z.number().int().min(1),
  name: z.string().trim().min(2).max(100),
  iban: z.string().trim().toUpperCase().regex(ibanRegex, m['errors.invalid_format']()),
  email: z.email(),
  phone: z.string().trim().min(6).max(20),
  idno: z.string().trim().min(3).max(50),
  bicSwift: z.string().trim().toUpperCase().regex(bicRegex, m['errors.invalid_format']()),
  bankName: z.string().trim().min(2).max(100),
  legalAddress: z.string().trim().min(5).max(200),
  actualAddress: z.string().trim().min(5).max(200),

}) satisfies ZodType<CreateVendorDto>;

export type TCreateVendor = z.infer<typeof createVendorSchema>;


export const updateVendorSchema = createVendorSchema.extend({}) satisfies ZodType<UpdateVendorDto>;
export type TUpdateVendor = z.infer<typeof updateVendorSchema>;