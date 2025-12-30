
import { z } from 'zod';

export const passwordValidation = z.string()
  .min(8, 'enter minimum 8 characters')
  .max(32, 'maximum 32 characters are allowed')
  .regex(/[A-Z]/, 'must contain at least one uppercase letter')
  .regex(/[a-z]/, 'must contain at least one lowercase letter')
  .regex(/[0-9]/, 'must contain at least one number')
  .regex(/[\W_]/, 'must contain at least one special character');