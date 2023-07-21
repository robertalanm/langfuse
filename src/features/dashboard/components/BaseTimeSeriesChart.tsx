import { type DateTimeAggregationOption } from "@/src/features/dashboard/lib/timeseriesAggregation";
import { AreaChart } from "@tremor/react";

export function BaseTimeSeriesChart(props: {
  agg: DateTimeAggregationOption;
  data: { ts: number; values: { label: string; value: number }[] }[];
}) {
  const labels = new Set(
    props.data.flatMap((d) => d.values.map((v) => v.label))
  );

  type ChartInput = { timestamp: string } & { [key: string]: number };

  function transformArray(
    array: { ts: number; values: { label: string; value: number }[] }[]
  ): ChartInput[] {
    return array.map((item) => {
      const outputObject: ChartInput = {
        timestamp: convertDate(item.ts, props.agg),
      } as ChartInput;

      item.values.forEach((valueObject) => {
        outputObject[valueObject.label] = valueObject.value;
      });

      return outputObject;
    });
  }

  const dataFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
  };

  const convertDate = (date: number, agg: DateTimeAggregationOption) => {
    if (agg === "24 hours" || agg === "1 hour") {
      return new Date(date).toLocaleTimeString("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return new Date(date).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    });
  };

  // Create a copy of the data
  let dataCopy = [...props.data];

  // Flatten all value numbers into a single array
  const allValues = dataCopy.flatMap(d => d.values.map(v => v.value));

  // Calculate the range of the values
  const valueRange = Math.max(...allValues) - Math.min(...allValues);

  // If the range is zero, add an offset to the values
  if (valueRange === 0) {
    const offset = 0.000000001;  // Define the offset

    // Add the offset to each value in the copied data
    dataCopy = dataCopy.map(d => ({
      ...d,
      values: d.values.map(v => ({ ...v, value: v.value + offset }))
    }));
  }

  return (
    <AreaChart
      className="mt-4 h-72"
      data={transformArray(dataCopy)}
      index="timestamp"
      categories={Array.from(labels)}
      colors={["green", "green"]}
      valueFormatter={dataFormatter}
    />
  );
}
