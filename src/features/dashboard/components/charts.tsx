import { api } from "@/src/utils/api";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/src/components/ui/card";
import { BaseTimeSeriesChart } from "./BaseTimeSeriesChart";
import { type DateTimeAggregationOption } from "@/src/features/dashboard/lib/timeseriesAggregation";
import { Loader } from "lucide-react";

export function ChartGenerations(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
}) {
  const data = api.dashboard.generations.useQuery({
    agg: props.agg,
    projectId: props.projectId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Generations</CardTitle>
        <CardDescription>Count</CardDescription>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}

export function ChartStakeOverTime(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
}) {
  const data = api.dashboard.stakeOverTime.useQuery({
    agg: props.agg,
    projectId: props.projectId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Total Stake</CardTitle>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : 
          <div className="absolute right-5 top-5 ">
            {(data.data?.[(data.data?.length || 0) - 1]?.values?.[0]?.value ?? 0) * 3}τ in the last {props.agg}
          </div>
        }
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}

export function ChartCombinedEmission(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
}) {
  const data = api.dashboard.emissionOverTime.useQuery({
    agg: props.agg,
    projectId: props.projectId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Total Emission</CardTitle>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : 
          <div className="absolute right-5 top-5 ">
            {(data.data?.[(data.data?.length || 0) - 1]?.values?.[0]?.value ?? 0) * 3}τ per hour
          </div>
        }
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}

export function ChartCombinedEmissionSubnet1(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
}) {
  const data = api.dashboard.emissionOverTimeSubnet1.useQuery({
    agg: props.agg,
    projectId: props.projectId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Total Emission: netuid 1</CardTitle>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : 
          <div className="absolute right-5 top-5 ">
            {(data.data?.[(data.data?.length || 0) - 1]?.values?.[0]?.value ?? 0) * 3}τ per hour
          </div>
        }
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}


export function ChartCombinedEmissionSubnet11(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
}) {
  const data = api.dashboard.emissionOverTimeSubnet11.useQuery({
    agg: props.agg,
    projectId: props.projectId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Total Emission: Netuid 11</CardTitle>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : 
          <div className="absolute right-5 top-5 ">
            {(data.data?.[(data.data?.length || 0) - 1]?.values?.[0]?.value ?? 0) * 3}τ per hour
          </div>
        }
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}

export function ChartTrustOverTime(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
  netuid: '1' | '11';
}) {
  const data = api.dashboard.trustOverTimeBySubnet.useQuery({
    agg: props.agg,
    projectId: props.projectId,
    netuid: props.netuid,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Trust Over Time (NetUID {props.netuid})</CardTitle>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}

export function ChartIncentiveOverTime(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
  netuid: string;
}) {
  const data = api.dashboard.incentiveOverTimeSubnet.useQuery({
    agg: props.agg,
    projectId: props.projectId,
    netuid: props.netuid,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Incentive Over Time: Netuid {props.netuid}</CardTitle>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}


export function ChartCombinedEmissionSubnet(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
  netuid: '1' | '11';
}) {
  const data =
    props.netuid === '1'
      ? api.dashboard.emissionOverTimeSubnet1.useQuery({
          agg: props.agg,
          projectId: props.projectId,
        })
      : api.dashboard.emissionOverTimeSubnet11.useQuery({
          agg: props.agg,
          projectId: props.projectId,
        });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Total Emission: Netuid {props.netuid}</CardTitle>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="absolute right-5 top-5 ">
            {(data.data?.[(data.data?.length || 0) - 1]?.values?.[0]?.value ?? 0) * 3}τ per hour
          </div>
        )}
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}

export function ChartTraces(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
}) {
  const data = api.dashboard.traces.useQuery({
    agg: props.agg,
    projectId: props.projectId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Traces</CardTitle>
        <CardDescription>Count</CardDescription>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}

export function ChartScores(props: {
  agg: DateTimeAggregationOption;
  projectId: string;
}) {
  const data = api.dashboard.scores.useQuery({
    agg: props.agg,
    projectId: props.projectId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Scores</CardTitle>
        <CardDescription>Average</CardDescription>
        {data.isLoading ? (
          <div className="absolute right-5 top-5 ">
            <Loader className="h-5 w-5 animate-spin" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <BaseTimeSeriesChart agg={props.agg} data={data.data ?? []} />
      </CardContent>
    </Card>
  );
}
