import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedProjectProcedure,
} from "@/src/server/api/trpc";
import { type Neuron } from "@/src/utils/types";

const NeuronFilterOptions = z.object({
  projectId: z.string(), // Required for protectedProjectProcedure
});

const NeuronInput = z.object({
  id: z.string().nullish(),
  projectId: z.string().nullish(),
  coldkey: z.string().nullish(),
  hotkey: z.string().nullish(),
  uid: z.number().nullish(),
  rank: z.number().nullish(),
  stake: z.number().nullish(),
  emission: z.number().nullish(),
  incentive: z.number().nullish(),
  consensus: z.number().nullish(),
  trust: z.number().nullish(),
  netuid: z.number().nullish(),
  registered: z.boolean().nullish(),
});

export const neuronsRouter = createTRPCRouter({
  all: protectedProjectProcedure
    .input(NeuronFilterOptions)
    .query(async ({ input, ctx }) => {
      const neurons = (await ctx.prisma.neurons.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: 100, // TODO: pagination
      })) as Neuron[];

      return neurons;
    }),

  uniqueMostRecent: protectedProjectProcedure
  .input(NeuronFilterOptions)
  .query(async ({ input, ctx }) => {
    // Get distinct combinations of 'coldkey' and 'hotkey'
    const neuronKeys = await ctx.prisma.neurons.findMany({
      select: { coldkey: true, hotkey: true, netuid: true },
      distinct: ['coldkey', 'hotkey', 'netuid'],
    });

    // For each combination, fetch the most recent neuron
    const mostRecentNeurons = await Promise.all(neuronKeys.map(async ({ coldkey, hotkey, netuid }) => {
      return await ctx.prisma.neurons.findFirst({
        where: {
          coldkey,
          hotkey,
          netuid,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
    }));

    return mostRecentNeurons;
  }),


  byId: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const neuron = (await ctx.prisma.neurons.findFirstOrThrow({
      where: {
        id: input,
        project: {
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
    })) as Neuron;

    return neuron;
  }),

  create: protectedProjectProcedure
    .input(NeuronInput)
    .mutation(async ({ input, ctx }) => {
      const neuron = (await ctx.prisma.neurons.create({
        data: {
          id: input.id ?? undefined,
          project: { connect: { id: input.projectId ? input.projectId : "" } },
          coldkey: input.coldkey ?? "", 
          hotkey: input.hotkey ?? "",
          uid: input.uid ?? 0,
          rank: input.rank ?? 0,
          stake: input.stake ?? 0,
          emission: input.emission ?? 0,
          incentive: input.incentive ?? 0,
          consensus: input.consensus ?? 0,
          trust: input.trust ?? 0,
          netuid: input.netuid ?? 0,
          registered: input.registered ?? false,
        },
      })) as Neuron;

      return neuron;
    }),

});
