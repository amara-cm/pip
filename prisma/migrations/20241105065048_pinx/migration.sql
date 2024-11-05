/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `coins` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `diamonds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referrerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegramId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `GameHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameHistory" DROP CONSTRAINT "GameHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_referrerId_fkey";

-- DropIndex
DROP INDEX "User_telegramId_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "coins",
DROP COLUMN "diamonds",
DROP COLUMN "ipAddress",
DROP COLUMN "referrerId",
DROP COLUMN "telegramId",
ADD COLUMN     "earned_coins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "GameHistory";

-- DropTable
DROP TABLE "Task";

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");
