-- Drop old unique constraint and index
DROP INDEX IF EXISTS "Lead_email_tripSlug_key";
DROP INDEX IF EXISTS "Lead_createdAt_idx";

-- Clear old test rows
DELETE FROM "Lead";

-- Drop old columns
ALTER TABLE "Lead" DROP COLUMN IF EXISTS "source";
ALTER TABLE "Lead" DROP COLUMN IF EXISTS "updatedAt";
ALTER TABLE "Lead" ALTER COLUMN "email" DROP NOT NULL;

-- Add new columns
ALTER TABLE "Lead" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Lead" ADD COLUMN "phone" TEXT;

-- Remove default now that table is empty
ALTER TABLE "Lead" ALTER COLUMN "name" DROP DEFAULT;

-- Recreate index
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
