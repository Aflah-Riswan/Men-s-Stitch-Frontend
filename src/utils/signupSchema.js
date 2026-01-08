import { string, z } from 'zod'

export const signupSchema = z.object({

  firstName: z.string().min(1, 'name is required')
    .regex(/^[A-Za-z]+$/, 'enter invalid name'),

  lastName: z.string().min(1, 'last name is required')
    .regex(/^[A-Za-z]+$/, 'enter valid last name'),

  phone: z.string()
    .transform((val) => {
      const cleaned = val.replace(/\D/g, '')
      return cleaned
    })
    .refine((val) => /^[6-9]\d{9}$/.test(val), { message: 'please enter valida phone number' }),

  otp: z.string().min(6, 'otp must be exactly 6 numbers')
    .max(6, 'otp must be exactly 6 numbers')
    .regex(/^\d/g, "OTP must contain only numbers"),

  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, 'enter a valid email'),

  password: z.string().min(8, 'enter minimum 8 characters ')
    .max(32, 'maximum 32 charcters are allowed')
    .regex(/[A-Z]/, 'must contain atleast one uppercase letter')
    .regex(/[a-z]/, 'must contain atleast one lowercase letter')
    .regex(/[0-9]/, 'must containe atleast one letter')
    .regex(/[\W_]/, 'must contain atleast one special character'),

  confirmPassword: z.string().min(8, ' enter minimum 8 chracters')
    .max(32, 'maximum 32 are allowed'),

  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  referralCode: z.string().optional(),

}).refine((data) => data.password === data.confirmPassword,
  { message: ' enter exacly same password', path: ['confirmPassword'] })