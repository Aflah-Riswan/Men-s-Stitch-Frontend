
import { z } from "zod";



export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .toUpperCase()
    .trim(),
    
  description: z
    .string()
    .min(10, "Please provide a detailed description")
    .max(200),

  discountType: z.enum(["Flat", "Percentage"]),

  discountValue: z.coerce
    .number()
    .min(1, "Value must be positive")
  
    .refine((val, ctx) => {
      
      return true; 
    }),

  minPurchaseAmount: z.coerce
    .number()
    .min(0, "Amount cannot be negative"),

  maxDiscountAmount: z.coerce
    .number()
    .min(0, "Amount cannot be negative"),

  usageLimit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .optional()
    .or(z.literal("")), 

  isUnlimited: z.boolean(),

  expiryDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Expiry date must be in the future",
  }),

  isActive: z.boolean().default(true),
})

.superRefine((data, ctx) => {

  if (data.discountType === "Percentage" && data.discountValue > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Percentage cannot exceed 100%",
      path: ["discountValue"],
    });
  }


  if (data.discountType === "Flat" && data.discountValue > data.minPurchaseAmount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Discount is higher than minimum purchase amount",
      path: ["discountValue"],
    });
  }

  if (!data.isUnlimited && (!data.usageLimit || data.usageLimit === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please set a limit or select Unlimited",
      path: ["usageLimit"],
    });
  }
});