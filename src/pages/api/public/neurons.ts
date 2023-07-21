import { prisma } from "@/src/server/db";
import { Neurons } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { cors, runMiddleware } from "./cors";
import { verifyAuthHeaderAndReturnScope } from "@/src/features/publicApi/server/apiAuth";
import { checkApiAccessScope } from "@/src/features/publicApi/server/apiScope";

const NeuronsCreateSchema = z.object({
  id: z.string().nullish(),
  projectId: z.string().nullish(),
  coldkey: z.string().nullish(),
  hotkey: z.string().nullish(),
  uid: z.number().nullish(),
  rank: z.string().nullish(),
  stake: z.string().nullish(),
  emission: z.string().nullish(),
  incentive: z.string().nullish(),
  consensus: z.string().nullish(),
  trust: z.string().nullish(),
  netuid: z.number().nullish(),
  registered: z.boolean().nullish()
});

const NeuronPatchSchema = z.object({
  neuronId: z.string(),
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
  registered: z.boolean().nullish()
});



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  // CHECK AUTH
  const authCheck = await verifyAuthHeaderAndReturnScope(
    req.headers.authorization
  );
  if (!authCheck.validKey)
    return res.status(401).json({
      success: false,
      message: authCheck.error,
    });
  // END CHECK AUTH

  if (req.method === "POST") {
    try {
      const obj = NeuronsCreateSchema.parse(req.body);
      const {
        id,
        projectId,
        coldkey,
        hotkey,
        uid,
        rank,
        stake,
        emission,
        incentive,
        consensus,
        trust,
        netuid,
        registered,
      } = obj;

      // CHECK ACCESS SCOPE
      const accessCheck = await checkApiAccessScope(authCheck.scope, [
        { type: "project", id: projectId ? projectId : "" },
      ]);
      if (!accessCheck)
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      // END CHECK ACCESS SCOPE

      const casted_rank = rank ? parseFloat(rank) : 0.0;
      const casted_stake = stake ? parseFloat(stake) : 0.0;
      const casted_emission = emission ? parseFloat(emission) : 0.0;
        
      const casted_incentive = incentive ? parseFloat(incentive) : 0.0;
      const casted_consensus = consensus ? parseFloat(consensus) : 0.0;
      const casted_trust = trust ? parseFloat(trust) : 0.0;

      const newNeuron = await prisma.neurons.create({
        data: {
          id: id ?? undefined,
          project: { connect: { id: projectId ? projectId : "" } },
          coldkey: coldkey ? coldkey : "",
          hotkey: hotkey ? hotkey : "",
          uid: uid ? uid : 0,
          rank: casted_rank,
          stake: casted_stake,
          emission: casted_emission,
          incentive: casted_incentive,
          consensus: casted_consensus,
          trust:  casted_trust,
          netuid: netuid ? netuid : 1,
          registered: registered ? registered : false,
        },
      });

      res.status(200).json(newNeuron);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: errorMessage,
      });
    }
  } else if (req.method === "PATCH") {
    try {
      const { neuronId, ...fields } = NeuronPatchSchema.parse(req.body);

      // CHECK ACCESS SCOPE
      const accessCheck = await checkApiAccessScope(authCheck.scope, [
        { type: "neuron", id: neuronId },
      ]);
      if (!accessCheck)
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      // END CHECK ACCESS SCOPE

      const updatedNeuron = await prisma.neurons.update({
        where: { id: neuronId },
        data: Object.fromEntries(
          Object.entries(fields).filter(
            ([_, v]) => v !== null && v !== undefined
          )
        ),
      });

      res.status(200).json(updatedNeuron);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      res.status(400).json({
        success: false,
        message: "Invalid request data",
        error: errorMessage,
      });
    }
  } else if (req.method === "DELETE") {
    // DELETE handling code
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
