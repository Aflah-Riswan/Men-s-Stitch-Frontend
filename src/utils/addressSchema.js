
import { z } from 'zod'

   export const addressSchema = z.object({
      firstName: z.string().trim().min(1).max(50),
      lastName: z.string().trim().min(1).max(50),
      phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
      
      addressLine1: z.string().trim().min(3),
      addressLine2: z.string().trim().optional(), 
      
      city: z.string().trim().min(2),
      state: z.string().trim().min(2),
      country: z.string().trim().min(2),
      pincode: z.string().trim().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
      
      label: z.string().trim().optional().default('Home'),
      isDefault: z.boolean().optional().default(false),
    });