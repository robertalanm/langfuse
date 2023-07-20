import {
  dateTimeAggregationOptions,
  dateTimeAggregationSettings,
} from "@/src/features/dashboard/lib/timeseriesAggregation";
import { z } from "zod";
import { sub, startOfHour, startOfDay, getUnixTime } from "date-fns";

import {
  createTRPCRouter,
  protectedProjectProcedure,
} from "@/src/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
incentiveOverTimeSubnet: protectedProjectProcedure
  .input(
    z.object({
      projectId: z.string(),
      netuid: z.string(),
      agg: z.enum(dateTimeAggregationOptions),
    })
  )
  .query(async ({ input, ctx }) => {
    const output = await ctx.prisma.$queryRawUnsafe<
      {
        date_trunc: Date;
        value: string;
      }[]
    >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${dateTimeAggregationSettings[input.agg].date_trunc}', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${dateTimeAggregationSettings[input.agg].date_trunc}', neurons.timestamp) as date_trunc,
          sum(incentive) as value
        FROM neurons
        WHERE neurons.timestamp > NOW() - INTERVAL '${input.agg}'
        AND neurons.project_id = '${input.projectId}'
        AND neurons.registered = true
        AND neurons.netuid = '${input.netuid}'
        GROUP BY 1
      )
      SELECT
        timeseries.date_trunc,
        COALESCE(metrics.value, 0) as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      ORDER BY 1
    `);

    return output.map((row) => ({
      ts: row.date_trunc.getTime(),
      values: [
        {
          label: 'incentive',
          value: Number(row.value),
        },
      ],
    }));
  }),


  trustOverTimeBySubnet: protectedProjectProcedure
  .input(
    z.object({
      projectId: z.string(),
      agg: z.enum(dateTimeAggregationOptions),
      netuid: z.union([z.literal('1'), z.literal('11')]),
    })
  )
  .query(async ({ input, ctx }) => {
    const output = await ctx.prisma.$queryRawUnsafe<
      {
        date_trunc: Date;
        value: string;
      }[]
    >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', neurons.timestamp) as date_trunc,
          sum(trust) as value
        FROM neurons
        WHERE neurons.timestamp > NOW() - INTERVAL '${input.agg}'
        AND neurons.project_id = '${input.projectId}'
        AND neurons.registered = true
        AND neurons.netuid = '${input.netuid}'
        GROUP BY 1
      )
      SELECT
        timeseries.date_trunc,
        COALESCE(metrics.value, 0) as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      ORDER BY 1
    `);

    return output.map((row) => ({
      ts: row.date_trunc.getTime(),
      values: [
        {
          label: 'trust',
          value: Number(row.value),
        },
      ],
    }));
  }),

  stakeOverTime: protectedProjectProcedure
  .input(
    z.object({
      projectId: z.string(),
      agg: z.enum(dateTimeAggregationOptions),
    })
  )
  .query(async ({ input, ctx }) => {
    const output = await ctx.prisma.$queryRawUnsafe<
      {
        date_trunc: Date;
        value: string;
      }[]
    >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${dateTimeAggregationSettings[input.agg].date_trunc}', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${dateTimeAggregationSettings[input.agg].date_trunc}', neurons.timestamp) as date_trunc,
          sum(stake) as value
        FROM neurons
        WHERE neurons.timestamp > NOW() - INTERVAL '${input.agg}'
        AND neurons.project_id = '${input.projectId}'
        AND neurons.registered = true
        GROUP BY 1
      )
      SELECT
        timeseries.date_trunc,
        COALESCE(metrics.value, 0) as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      ORDER BY 1
    `);

    return output.map((row) => ({
      ts: row.date_trunc.getTime(),
      values: [
        {
          label: 'stake',
          value: Number(row.value),
        },
      ],
    }));
  }),

  emissionOverTimeSubnet1: protectedProjectProcedure
  .input(
    z.object({
      projectId: z.string(),
      agg: z.enum(dateTimeAggregationOptions),
    })
  )
  .query(async ({ input, ctx }) => {
    const output = await ctx.prisma.$queryRawUnsafe<
      {
        date_trunc: Date;
        value: string;
      }[]
    >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', neurons.timestamp) as date_trunc,
          sum(emission) as value
        FROM neurons
        WHERE neurons.timestamp > NOW() - INTERVAL '${input.agg}'
        AND neurons.project_id = '${input.projectId}'
        AND neurons.netuid = 1
        AND neurons.registered = true
        GROUP BY 1
      )
      SELECT
        timeseries.date_trunc,
        COALESCE(metrics.value, 0) as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      ORDER BY 1
    `);

    return output.map((row) => ({
      ts: row.date_trunc.getTime(),
      values: [
        {
          label: 'emission',
          value: Number(row.value),
        },
      ],
    }));
  }),

emissionOverTimeSubnet11: protectedProjectProcedure
  .input(
    z.object({
      projectId: z.string(),
      agg: z.enum(dateTimeAggregationOptions),
    })
  )
  .query(async ({ input, ctx }) => {
    const output = await ctx.prisma.$queryRawUnsafe<
      {
        date_trunc: Date;
        value: string;
      }[]
    >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', neurons.timestamp) as date_trunc,
          sum(emission) as value
        FROM neurons
        WHERE neurons.timestamp > NOW() - INTERVAL '${input.agg}'
        AND neurons.project_id = '${input.projectId}'
        AND neurons.netuid = 11
        AND neurons.registered = true
        GROUP BY 1
      )
      SELECT
        timeseries.date_trunc,
        COALESCE(metrics.value, 0) as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      ORDER BY 1
    `);

    return output.map((row) => ({
      ts: row.date_trunc.getTime(),
      values: [
        {
          label: 'emission',
          value: Number(row.value),
        },
      ],
    }));
  }),
  emissionOverTime: protectedProjectProcedure
  .input(
    z.object({
      projectId: z.string(),
      agg: z.enum(dateTimeAggregationOptions),
    })
  )
  .query(async ({ input, ctx }) => {
    const output = await ctx.prisma.$queryRawUnsafe<
      {
        date_trunc: Date;
        value: string;
      }[]
    >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', neurons.timestamp) as date_trunc,
          sum(emission) as value
        FROM neurons
        WHERE neurons.timestamp > NOW() - INTERVAL '${input.agg}'
        AND neurons.project_id = '${input.projectId}'
        AND neurons.registered = true
        GROUP BY 1
      )
      SELECT
        timeseries.date_trunc,
        COALESCE(metrics.value, 0) as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      ORDER BY 1
    `);

    return output.map((row) => ({
      ts: row.date_trunc.getTime(),
      values: [
        {
          label: 'emission',
          value: Number(row.value),
        },
      ],
    }));
  }),
  generations: protectedProjectProcedure
    .input(
      z.object({
        projectId: z.string(),
        agg: z.enum(dateTimeAggregationOptions),
      })
    )
    .query(async ({ input, ctx }) => {
      // queryRawUnsafe to add input.agg to the WHERE clause
      const output = await ctx.prisma.$queryRawUnsafe<
        {
          date_trunc: Date;
          value: number;
        }[]
      >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', start_time) as date_trunc,
          count(*)::integer as value
        FROM observations
        LEFT JOIN traces ON observations.trace_id = traces.id

        WHERE
        type = 'GENERATION'
        AND start_time > NOW() - INTERVAL '${input.agg}'
        AND traces.project_id = '${input.projectId}'

        GROUP BY 1
      )

      SELECT
        timeseries.date_trunc,
        COALESCE(sum(metrics.value), 0)::integer as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      GROUP BY 1
      ORDER BY 1
      `);

      return output.map((row) => ({
        ...row,
        values: [
          {
            label: "count",
            value: row.value,
          },
        ],
        ts: row.date_trunc.getTime(),
      }));
    }),
  traces: protectedProjectProcedure
    .input(
      z.object({
        projectId: z.string(),
        agg: z.enum(dateTimeAggregationOptions),
      })
    )
    .query(async ({ input, ctx }) => {
      // queryRawUnsafe to add input.agg to the WHERE clause
      const output = await ctx.prisma.$queryRawUnsafe<
        {
          date_trunc: Date;
          value: number;
        }[]
      >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', dt) as date_trunc,
          0 as value
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', timestamp) as date_trunc,
          count(*)::integer as value
        FROM traces
        WHERE timestamp > NOW() - INTERVAL '${input.agg}'
        AND traces.project_id = '${input.projectId}'
        GROUP BY 1
      )

      SELECT
        timeseries.date_trunc,
        COALESCE(sum(metrics.value), 0)::integer as value
      FROM timeseries
      LEFT JOIN metrics ON timeseries.date_trunc = metrics.date_trunc
      GROUP BY 1
      ORDER BY 1
      `);

      return output.map((row) => ({
        ...row,
        values: [
          {
            label: "count",
            value: row.value,
          },
        ],
        ts: row.date_trunc.getTime(),
      }));
    }),
  scores: protectedProjectProcedure
    .input(
      z.object({
        projectId: z.string(),
        agg: z.enum(dateTimeAggregationOptions),
      })
    )
    .query(async ({ input, ctx }) => {
      // queryRawUnsafe to add input.agg to the WHERE clause
      const output = await ctx.prisma.$queryRawUnsafe<
        {
          date_trunc: Date;
          values: {
            [key: string]: number;
          } | null;
        }[]
      >(`
      WITH timeseries AS (
        SELECT
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', dt) as date_trunc
        FROM generate_series(
          NOW() - INTERVAL '${input.agg}', NOW(), INTERVAL '1 minute'
        ) as dt
        WHERE dt > NOW() - INTERVAL '${input.agg}'
        GROUP BY 1
      ),
      metrics AS (
        SELECT 
          date_trunc('${
            dateTimeAggregationSettings[input.agg].date_trunc
          }', scores.timestamp) as date_trunc,
          scores.name as metric_name,
          AVG(value) as avg_value
        FROM scores
        LEFT JOIN traces ON scores.trace_id = traces.id
        WHERE scores.timestamp > NOW() - INTERVAL '${input.agg}'
        AND traces.project_id = '${input.projectId}'
        GROUP BY 1,2
      ),
      json_metrics AS (
        SELECT
          date_trunc,
          jsonb_object_agg(metric_name, avg_value) as values
        FROM metrics
        GROUP BY 1
      )
      SELECT
        timeseries.date_trunc,
        json_metrics.values as values
      FROM timeseries
      LEFT JOIN json_metrics ON timeseries.date_trunc = json_metrics.date_trunc
      ORDER BY 1
      `);

      return output.map((row) => ({
        ...row,
        values: row.values
          ? Object.entries(row.values).map(([label, value]) => ({
              label: "avg_" + label,
              value,
            }))
          : [],
        ts: row.date_trunc.getTime(),
      }));
    }),
    
});
