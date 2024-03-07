/*
  Warnings:

  - Added the required column `userId` to the `CommentReply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentReply" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
