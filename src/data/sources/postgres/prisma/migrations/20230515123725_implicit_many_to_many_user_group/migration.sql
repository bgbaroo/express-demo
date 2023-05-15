/*
  Warnings:

  - You are about to drop the `UserOnGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnGroup" DROP CONSTRAINT "UserOnGroup_userId_fkey";

-- DropTable
DROP TABLE "UserOnGroup";

-- CreateTable
CREATE TABLE "_Memberships" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Memberships_AB_unique" ON "_Memberships"("A", "B");

-- CreateIndex
CREATE INDEX "_Memberships_B_index" ON "_Memberships"("B");

-- AddForeignKey
ALTER TABLE "_Memberships" ADD CONSTRAINT "_Memberships_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Memberships" ADD CONSTRAINT "_Memberships_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
