// src/utils/validation.ts
import { z } from "zod";

export const deleteSchema = z.object({
  reason: z.string().min(1, "Confirmation is required"),
});
export type DeleteType = z.infer<typeof deleteSchema>;
