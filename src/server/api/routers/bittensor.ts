// import { z } from "zod";

// import {
//   createTRPCRouter,
//   protectedProcedure,
//   protectedProjectProcedure,
// } from "@/src/server/api/trpc";

// const ColdkeyFilterOptions = z.object({
//     projectId: z.string(),
//   });
  
//   export const coldkeyRouter = createTRPCRouter({
//     all: protectedProjectProcedure
//       .input(ColdkeyFilterOptions)
//       .query(async ({ input, ctx }) => {
//         const coldkeys = await ctx.prisma.coldkey.findMany({
//           where: {
//             projectId: input.projectId,
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//           take: 100,
//         });
  
//         return coldkeys;
//       }),
  
//     byId: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
//       const coldkey = await ctx.prisma.coldkey.findFirstOrThrow({
//         where: {
//           id: input,
//           project: {
//             members: {
//               some: {
//                 userId: ctx.session.user.id,
//               },
//             },
//           },
//         },
//       });
  
//       return coldkey;
//     }),
//   });
  
//   const HotkeyFilterOptions = z.object({
//     projectId: z.string(),
//   });
  
//   export const hotkeyRouter = createTRPCRouter({
//     all: protectedProjectProcedure
//       .input(HotkeyFilterOptions)
//       .query(async ({ input, ctx }) => {
//         const hotkeys = await ctx.prisma.hotkey.findMany({
//           where: {
//             projectId: input.projectId,
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//           take: 100,
//         });
  
//         return hotkeys;
//       }),
  
//     byId: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
//       const hotkey = await ctx.prisma.hotkey.findFirstOrThrow({
//         where: {
//           ss_58: input,
//           project: {
//             members: {
//               some: {
//                 userId: ctx.session.user.id,
//               },
//             },
//           },
//         },
//       });
  
//       return hotkey;
//     }),
//   });
  
//   const WalletFilterOptions = z.object({
//     projectId: z.string(),
//   });
  
//   export const walletRouter = createTRPCRouter({
//     all: protectedProjectProcedure
//       .input(WalletFilterOptions)
//       .query(async ({ input, ctx }) => {
//         const wallets = await ctx.prisma.wallet.findMany({
//           where: {
//             projectId: input.projectId,
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//           take: 100,
//         });
  
//         return wallets;
//       }),
  
//     byId: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
//       const wallet = await ctx.prisma.wallet.findFirstOrThrow({
//         where: {
//           id: input,
//           project: {
//             members: {
//               some: {
//                 userId: ctx.session.user.id,
//               },
//             },
//           },
//         },
//       });
  
//       return wallet;
//     }),
//   });
  