/*
  Warnings:

  - Added the required column `userId` to the `PostComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostComment" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
