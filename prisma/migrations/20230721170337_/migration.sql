/*
  Warnings:

  - You are about to alter the column `uid` on the `neurons` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "neurons" ALTER COLUMN "uid" SET DEFAULT 0,
ALTER COLUMN "uid" SET DATA TYPE INTEGER;
