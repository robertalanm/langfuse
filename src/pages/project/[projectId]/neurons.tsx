import Header from "@/src/components/layouts/header";
import { api } from "@/src/utils/api";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/src/components/table/data-table";
import TableLink from "@/src/components/table/table-link";
import { DataTableToolbar } from "@/src/components/table/data-table-toolbar";
import { type RouterOutput, type RouterInput } from "@/src/utils/types";
import { useState } from "react";
import { useRouter } from "next/router";

type NeuronTableRow = {
  id: string;
  coldkey: string;
  hotkey: string;
  uid: number;
  rank: number;
  stake: number;
  emission: number;
  incentive: number;
  consensus: number;
  trust: number;
  netuid: number;
  registered: boolean;
};

type NeuronFilterInput = Omit<RouterInput["neurons"]["uniqueMostRecent"], "projectId">;

export default function Neurons() {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  const [queryOptions, setQueryOptions] = useState<NeuronFilterInput>({});

  const uniqueMostRecentNeuron = api.neurons.uniqueMostRecent.useQuery({
    projectId,
  });

  const columns: ColumnDef<NeuronTableRow>[] = [
    {
      accessorKey: "id",
      header: "ID",
      // ...
    },
    {
      accessorKey: "coldkey",
      header: "Coldkey",
    },
    {
      accessorKey: "hotkey",
      header: "Hotkey",
    },
    {
      accessorKey: "uid",
      header: "UID",
    },
    {
      accessorKey: "rank",
      header: "Rank",
    },
    {
      accessorKey: "stake",
      header: "Stake",
    },
    {
      accessorKey: "emission",
      header: "Emission",
    },
    {
      accessorKey: "incentive",
      header: "Incentive",
    },
    {
      accessorKey: "consensus",
      header: "Consensus",
    },
    {
      accessorKey: "trust",
      header: "Trust",
    },
    {
      accessorKey: "netuid",
      header: "Netuid",
    },
    {
      accessorKey: "registered",
      header: "Registered",
    },
    {
      accessorKey: "timestamp",
      header: "updated",
    }
  ];
  
  const now = new Date().getTime();
  function timeDifferenceInWords(ms: number) {
    const sec = Math.abs(ms / 1000);
    const min = Math.abs(sec / 60);
    const hour = Math.abs(min / 60);
    const day = Math.abs(hour / 24);
  
    if (day >= 1) return Math.floor(day).toString() + ' day(s) ago';
    if (hour >= 1) return Math.floor(hour).toString() + ' hour(s) ago';
    if (min >= 1) return Math.floor(min).toString() + ' minute(s) ago';
    if (sec >= 1) return Math.floor(sec).toString() + ' second(s) ago';
    return 'just now';
  }
  
  
  
  const rows: NeuronTableRow[] = uniqueMostRecentNeuron.isSuccess
    ? uniqueMostRecentNeuron.data.map((neuron) => ({
        id: neuron?.id || "",
        coldkey: neuron?.coldkey || '',
        hotkey: neuron?.hotkey || '',
        uid: neuron?.uid || 0,
        rank: neuron?.rank || 0,
        stake: neuron?.stake || 0,
        emission: neuron?.emission || 0,
        incentive: neuron?.incentive || 0,
        consensus: neuron?.consensus || 0,
        trust: neuron?.trust || 0,
        netuid: neuron?.netuid || 0,
        registered: neuron?.registered || false,
        // get difference between now and timestamp
        timestamp: neuron?.timestamp ? timeDifferenceInWords(now - new Date(neuron.timestamp).getTime()) : 'Unknown',
      }))
    : [];

  return (
    <div className="container">
      <Header title="Neurons" />
      <DataTable
        columns={columns}
        data={
          uniqueMostRecentNeuron.isLoading
            ? { isLoading: true, isError: false }
            : uniqueMostRecentNeuron.isError
            ? {
                isLoading: false,
                isError: true,
                error: uniqueMostRecentNeuron.error.message,
              }
            : {
                isLoading: false,
                isError: false,
                data: rows,
              }
        }
        options={{ isLoading: true, isError: false }}
      />
    </div>
  );
}
