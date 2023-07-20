import { useState } from "react";
import Header from "@/src/components/layouts/header";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  dateTimeAggregationOptions,
  type DateTimeAggregationOption,
} from "@/src/features/dashboard/lib/timeseriesAggregation";
import {
  ChartGenerations,
  ChartScores,
  ChartTraces,
  ChartCombinedEmission,
  ChartCombinedEmissionPerNetuid,
  ChartStakeOverTime,
  ChartTrustOverTime,
  ChartIncentiveOverTime,
  ChartConsensusPerNetuid
} from "@/src/features/dashboard/components/charts";
import { useRouter } from "next/router";

type NetuidOption = "1" | "11" | "total";

export default function Start() {
  const [agg, setAgg] = useState<DateTimeAggregationOption>("7 days");
  const [netuid, setNetuid] = useState<NetuidOption>("total");
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const handleNetuidChange = (value: string) => {
    setNetuid(value as NetuidOption);
  };
  return (
    <>
      <Header title="Dashboard" />
      <div className="grid gap-4 mb-4 grid-cols-1">
        <div className="">
          <Tabs
            value={agg}
            onValueChange={(value) => setAgg(value as DateTimeAggregationOption)}
          >
            <TabsList>
              {dateTimeAggregationOptions.map((option) => (
                <TabsTrigger key={option} value={option}>
                  {option}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div>
          <Tabs value={netuid} onValueChange={handleNetuidChange}>
            <TabsList>
              <TabsTrigger value="total">Total</TabsTrigger>
              <TabsTrigger value="1">NetUID 1</TabsTrigger>
              <TabsTrigger value="11">NetUID 11</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-6">
  {netuid === "total" && (
    <>
      <div className="col-span-1 md:col-span-2 xl:col-span-4">
        <ChartCombinedEmission agg={agg} projectId={projectId} />
      </div>
      <div className="col-span-1 md:col-span-2 xl:col-span-2">
        <ChartStakeOverTime agg={agg} projectId={projectId} />
      </div>

    </>
  )}
  {netuid !== "total" && (
    <>
      <div className="col-span-1 md:col-span-2 xl:col-span-6">
        <ChartCombinedEmissionPerNetuid agg={agg} projectId={projectId} netuid={netuid} />
      </div>
      <div className="col-span-1 md:col-span-2 xl:col-span-2">
        <ChartTrustOverTime agg={agg} projectId={projectId} netuid={netuid} />
      </div>
      <div className="col-span-1 md:col-span-2 xl:col-span-4">
        <ChartIncentiveOverTime agg={agg} projectId={projectId} netuid={netuid} />
      </div>
      <div className="col-span-1 md:col-span-2 xl:col-span-2">
        <ChartConsensusPerNetuid agg={agg} projectId={projectId} netuid={netuid} />
      </div>
    </>
  )}
  <div className="col-span-1 md:col-span-2 xl:col-span-2">
    <ChartTraces agg={agg} projectId={projectId} />
  </div>
  <div className="col-span-1 md:col-span-2 xl:col-span-4">
    <ChartGenerations agg={agg} projectId={projectId} />
  </div>
  <div className="col-span-1 md:col-span-2 xl:col-span-6">
    <ChartScores agg={agg} projectId={projectId} />
  </div>
</div>
    </>
  );
}
