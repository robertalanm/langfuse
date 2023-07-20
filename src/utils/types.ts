import { type Observation } from "@prisma/client";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/src/server/api/root";

export type NestedObservation = Observation & {
  children: NestedObservation[];
};

export type TypedObservation = Event | Span | Generation;

export type Event = Observation & {
  type: "EVENT";
};

export type Span = Observation & {
  type: "SPAN";
  endTime: Date; // not null
};

export type LLMChatMessages = { role: string; content: string };

export type GenerationUsage = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export type Generation = Observation & {
  type: "GENERATION";
  usage: GenerationUsage;
  modelParameters: {
    [key: string]: string | number | boolean;
  };
};


// type NeuronTableRow = {
//   id: string;
//   coldkey: string;
//   hotkey: string;
//   uid: number;
//   rank: number;
//   stake: number;
//   emission: number;
//   incentive: number;
//   consensus: number;
//   trust: number;
//   registered: boolean;
// };

export type Neuron = {
  id: string;
  projectId: string;
  timestamp: Date;
  coldkey: string | undefined;
  hotkey: string | undefined;
  uid: number | undefined;
  rank: number | undefined;
  stake: number | undefined;
  emission: number | undefined;
  incentive: number | undefined;
  consensus: number | undefined;
  trust: number | undefined;
  netuid: number | undefined;
  registered: boolean | undefined;
};

  

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
