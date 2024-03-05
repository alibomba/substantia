/*
  Warnings:

  - A unique constraint covering the columns `[stripeChannelPlanID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_stripeChannelPlanID_key" ON "User"("stripeChannelPlanID");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerID_key" ON "User"("stripeCustomerID");
