/*
  Warnings:

  - The primary key for the `UserOnGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserOnGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserOnGroup_pkey" PRIMARY KEY ("groupId", "userId");
