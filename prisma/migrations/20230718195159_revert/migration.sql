/*
  Warnings:

  - You are about to drop the column `created_at` on the `neurons` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `neurons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "neurons" DROP COLUMN "created_at",
DROP COLUMN "updated_at";
