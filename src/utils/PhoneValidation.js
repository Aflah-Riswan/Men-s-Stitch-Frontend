import { z } from 'zod';

export const PhoneValidation = z.object({
  phone: z.string()
    .min(10, "Phone number must be 10 digits") 
    .max(10, "Phone number must be 10 digits")
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^[6-9]\d{9}$/.test(val), { 
      message: 'Enter a valid mobile number starting with 6-9' 
    }),

  otp: z.string()
    .optional() 
    .refine((val) => {
      if (!val) return true; 
      return /^\d{6}$/.test(val);
    }, { message: "OTP must be exactly 6 numbers" })
});