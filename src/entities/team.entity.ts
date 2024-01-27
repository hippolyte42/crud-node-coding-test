import { z } from "zod";

export const TeamEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  memberIds: z.array(z.string()),
});

export type TeamEntity = z.infer<typeof TeamEntitySchema>;
