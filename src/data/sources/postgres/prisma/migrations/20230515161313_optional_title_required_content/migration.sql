/*
  Warnings:

  - Made the column `content` on table `Clipboard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Clipboard" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" SET NOT NULL;
