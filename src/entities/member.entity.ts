import { z } from "zod";

export const MemberEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type MemberEntity = z.infer<typeof MemberEntitySchema>;
