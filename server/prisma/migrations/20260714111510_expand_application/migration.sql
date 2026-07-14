/*
  Warnings:

  - The `status` column on the `Application` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appUrl` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coreFunctionalities` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developerName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconIndex` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedOn` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theme` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "appUrl" TEXT NOT NULL,
ADD COLUMN     "backendStack" TEXT[],
ADD COLUMN     "coreFunctionalities" TEXT NOT NULL,
ADD COLUMN     "developerName" TEXT NOT NULL,
ADD COLUMN     "frontendStack" TEXT[],
ADD COLUMN     "iconIndex" INTEGER NOT NULL,
ADD COLUMN     "manualMimeType" TEXT,
ADD COLUMN     "manualOriginalName" TEXT,
ADD COLUMN     "manualSize" INTEGER,
ADD COLUMN     "manualStorageName" TEXT,
ADD COLUMN     "publishedOn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "theme" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
