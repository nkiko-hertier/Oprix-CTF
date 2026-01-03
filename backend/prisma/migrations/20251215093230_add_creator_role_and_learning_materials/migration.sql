-- CreateEnum
CREATE TYPE "CreatorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CREATOR';

-- CreateTable
CREATE TABLE "CompetitionCreator" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "status" "CreatorStatus" NOT NULL DEFAULT 'PENDING',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorInvite" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "acceptedByUserId" TEXT,
    "createdByAdminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningMaterial" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "linkUrl" TEXT NOT NULL,
    "resources" JSONB,
    "createdByUserId" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompetitionCreator_competitionId_idx" ON "CompetitionCreator"("competitionId");

-- CreateIndex
CREATE INDEX "CompetitionCreator_creatorId_idx" ON "CompetitionCreator"("creatorId");

-- CreateIndex
CREATE INDEX "CompetitionCreator_status_idx" ON "CompetitionCreator"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionCreator_competitionId_creatorId_key" ON "CompetitionCreator"("competitionId", "creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorInvite_tokenHash_key" ON "CreatorInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "CreatorInvite_competitionId_idx" ON "CreatorInvite"("competitionId");

-- CreateIndex
CREATE INDEX "CreatorInvite_email_idx" ON "CreatorInvite"("email");

-- CreateIndex
CREATE INDEX "CreatorInvite_tokenHash_idx" ON "CreatorInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "CreatorInvite_expiresAt_idx" ON "CreatorInvite"("expiresAt");

-- CreateIndex
CREATE INDEX "LearningMaterial_createdByUserId_idx" ON "LearningMaterial"("createdByUserId");

-- CreateIndex
CREATE INDEX "LearningMaterial_isVisible_idx" ON "LearningMaterial"("isVisible");

-- CreateIndex
CREATE INDEX "LearningMaterial_createdAt_idx" ON "LearningMaterial"("createdAt");

-- AddForeignKey
ALTER TABLE "CompetitionCreator" ADD CONSTRAINT "CompetitionCreator_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionCreator" ADD CONSTRAINT "CompetitionCreator_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorInvite" ADD CONSTRAINT "CreatorInvite_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorInvite" ADD CONSTRAINT "CreatorInvite_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
