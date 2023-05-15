/*
  Warnings:

  - You are about to drop the column `Expiration` on the `Clipboard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clipboard" DROP COLUMN "Expiration",
ADD COLUMN     "expiration" TIMESTAMP(3);
