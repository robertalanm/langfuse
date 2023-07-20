import { createTRPCRouter, protectedProjectProcedure } from "@/src/server/api/trpc";
import { z } from "zod";

export const walletsRouter = createTRPCRouter({
  getUnique: protectedProjectProcedure
    .input(z.object({
      projectId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const output = await ctx.prisma.$queryRawUnsafe<
        {
            hotkey: string;
            coldkey: string;
            registered: boolean;
        }[]
      >(`
        SELECT DISTINCT hotkey, coldkey, registered
        FROM neurons
        WHERE project_id = '${input.projectId}'
      `);
      return output.map((row) => ({
        hotkey: row.hotkey,
        coldkey: row.coldkey,
        registered: row.registered,
      }));
    }),
});
