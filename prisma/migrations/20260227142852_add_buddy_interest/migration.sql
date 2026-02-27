-- CreateTable
CREATE TABLE "TripBuddyInterest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripBuddyInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripBuddyInterest_userId_postId_key" ON "TripBuddyInterest"("userId", "postId");

-- AddForeignKey
ALTER TABLE "TripBuddyInterest" ADD CONSTRAINT "TripBuddyInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripBuddyInterest" ADD CONSTRAINT "TripBuddyInterest_postId_fkey" FOREIGN KEY ("postId") REFERENCES "TripBuddyPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
