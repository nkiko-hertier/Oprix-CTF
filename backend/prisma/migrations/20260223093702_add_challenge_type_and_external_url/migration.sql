-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('STATIC', 'DOWNLOAD', 'EXTERNAL_URL');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "challengeType" "ChallengeType" NOT NULL DEFAULT 'STATIC',
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "flagSalt" TEXT NOT NULL DEFAULT 'h3xsalt',
ALTER COLUMN "competitionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "competitionId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Challenge_challengeType_idx" ON "Challenge"("challengeType");
